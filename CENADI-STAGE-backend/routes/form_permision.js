const express = require("express");
const router = express.Router();
const multer = require('multer');
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../mesData/COURS Mr DEBALOU'); // Spécifiez l'emplacement du répertoire où vous souhaitez stocker les fichiers téléchargés
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Utilisez le nom d'origine du fichier comme nom de fichier sur le disque
  }
});


const upload = multer({ storage: storage });



router.post("/form_permision", upload.single('accord'),authMiddleware, (req, res) => {
  const filePath = req.file.path;
  // Traitez le fichier téléchargé (par exemple, déplacez-le vers un autre emplacement ou effectuez d'autres opérations)
  const data = req.body;
  const { MATRICULE, PASSWORD } = req.body;

  db.query(
    `SELECT * FROM "agt" WHERE "matricule" = $1`,
    [data.MATRICULE],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de la récupération des données :", err);
        return res.status(401).json({
          msg: "Erreur lors de la récupération des données",
        });
      }

      if (!result.rows) {
        console.log(result.rows);
        return res.status(401).json({
          msg: "Le matricule n'a pas été reconnu",
        });
      }

      db.query(
        `SELECT * FROM "permision" WHERE  "matricule" = $1 AND "date_per" = $2 AND "isaccepted" = $3 `,
        [data.MATRICULE, data.DATE_PER, 0],
        (err, result) => {
          if (err) {
            throw err;
          }
          if (result.rowCount !== 0) {
            return res.status(401).json({
              msg: "Vous avez déjà demandé une permission pour la même journée",
            });
          } else {
            // Calculer la différence en millisecondes entre les deux dates
            const differenceEnMs = Math.abs(
              new Date(data.DATE_PER) - new Date(data.DATE_RETOUR)
            );

            // Convertir la différence en jours
            const differenceEnJours = Math.floor(
              differenceEnMs / (1000 * 60 * 60 * 24)
            );
            //console.log("Valeurs à insérer :", data.MATRICULE, data.DATE_PER, data.DATE_RETOUR, data.MOTIF, data.DATE);
            // Vérifier si la différence dépasse 3 jours
            if (differenceEnJours > 3) {
              return res.status(401).json({
                msg: "La durée maximale des permissions est de 3 jours",
              });
            } else {
              db.query(
                `INSERT INTO permision (matricule, date_per, date_retour, motif, date, accord)
                VALUES ($1, $2, $3, $4, $5,$6);`,
                [
                  data.MATRICULE,
                  data.DATE_PER,
                  data.DATE_RETOUR,
                  data.MOTIF,
                  data.DATE,
                  filePath,
                ],
                (err, result) => {
                  if (err) {
                    console.error(
                      "Erreur lors de l'insertion des données :",
                      err
                    );
                    return res.status(401).json({
                      msg: "Erreur lors de l'insertion des données",
                    });
                  } else {
                    //console.log("Données insérées avec succès");
                    return res.status(200).json({
                      msg: "Permission enregistrée !",
                      user: data,
                      nb_jour: differenceEnJours
                    });
                  }
                }
              );
            }
          }
        }
      );
    }
  );
});

module.exports = router;