const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const { form_presenceValidation } = require("../validation");
const authMiddleware = require('../authMiddleware');

router.post("/insertPresence", form_presenceValidation, authMiddleware, (req, res) => {
  const data = req.body;
  console.log(data);

  if (data.HEURE_DEPART < data.HEURE_ARRIVER) {
    return res.status(401).json({
      msg: "L'heure de départ ne peut pas être supérieure à l'heure d'arrivée",
    });
  }

  db.query(
    `SELECT *
  FROM "presences"
  WHERE "matricule" = $1 AND "date" = $2 AND "isdeleted" = $3`, [data.MATRICULE, data.DATE, 0],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de la récupération des données :", err);
        return res.status(500).json({
          msg: "Une erreur inattendue est survenue",
        });
      }

      if (result.rowCount === 0) {
        db.query(
          `SELECT *
        FROM "presences";`,
          (err, result) => {
            if (err) {
              console.error("Erreur lors de la récupération des données :", err);
              return res.status(404).json({
                msg: "Le tableau est vide!",
              });
            } else {

              db.query(`INSERT INTO presences ( "matricule", "arrive", "depart", "date") 
            VALUES ($1,$2,$3,$4)`, [data.MATRICULE, data.HEURE_ARRIVER, data.HEURE_DEPART, data.DATE], (err, result) => {
                if (err) {
                  console.error("Erreur lors de l'insertion des données :", err);
                  return res.status(401).json({
                    msg: "Erreur lors de l'insertion des données",
                  });
                } else {
                  console.log("Données insérées avec succès");
                  return res.status(200).json({
                    msg: "Présence enregistrée !",
                    user: data,
                  });
                }
              });

            }
          }
        );


      } else {
        return res.status(401).send({
          msg: "Impossible d'insérer une autre entrée pour vous aujourd'hui",
        });
      }
    }
  );


});

module.exports = router;