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


router.post("/form_conge", upload.single('accord'), authMiddleware, (req, res) => {
  const filePath = req.file.path;
  const data = req.body;

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
        `SELECT * FROM "conges" WHERE "matricule" = $1 AND "type" = $2 AND "isaccepted" = $3`,
        [data.MATRICULE, data.TYPE, 1],
        (err, result) => {
          if (err) {
            console.error("Erreur lors de la récupération des données :", err);
            return res.status(401).json({
              msg: "Erreur lors de la récupération des données",
            });
          }

          if (result.rowCount !== 0) {
            return res.status(401).json({
              msg: "Vous avez déjà pris une permission de ce type et elle a été acceptée",
            });
          } else {
            db.query(
              `SELECT * FROM "conges" WHERE "matricule" = $1 AND "date_per" = $2 AND "isaccepted" = $3`,
              [data.MATRICULE, data.DATE_PER, 0],
              (err, result) => {
                if (err) {
                  throw err;
                }

                if (result.rowCount !== 0) {
                  return res.status(401).json({
                    msg: "Vous avez déjà demandé un congé pour la même journée",
                  });
                } else {
                  if (data.TYPE === "paternité") {
                    // Calculer la différence en jours entre les deux dates
                    const differenceEnJours = Math.floor(
                      (new Date(data.DATE_RETOUR) - new Date(data.DATE_PER)) / (1000 * 60 * 60 * 24)
                    );

                    if (differenceEnJours > 3) {
                      return res.status(401).json({
                        msg: "La durée maximale des congés pour la paternité est de 3 jours",
                      });
                    }
                  } else {
                    // Calculer la différence en mois entre les deux dates
                    const differenceEnMois = Math.floor(
                      (new Date(data.DATE_RETOUR).getFullYear() - new Date(data.DATE_PER).getFullYear()) * 12 +
                      (new Date(data.DATE_RETOUR).getMonth() - new Date(data.DATE_PER).getMonth())
                    );

                    if (differenceEnMois > 2) {
                      return res.status(401).json({
                        msg: "La durée maximale des congés pour les autres types est de 2 mois",
                      });
                    }
                  }

                  db.query(
                    `INSERT INTO conges (matricule, date_per, date_retour, isaccepted, date, accord, type)
                    VALUES ($1, $2, $3, 1, $4, $5, $6);`,
                    [
                      data.MATRICULE,
                      data.DATE_PER,
                      data.DATE_RETOUR,
                      data.DATE,
                      filePath,
                      data.TYPE
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
                        return res.status(200).json({
                          msg: "Permission enregistrée !",
                          user: data,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  );
});

module.exports = router;