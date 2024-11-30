const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require('../authMiddleware');
const { body } = require("express-validator");

router.put("/update", authMiddleware, (req, res) => {
  const depart = req.body.HEURE_DEPART;
  const arrive = req.body.HEURE_ARRIVER;
  const updatedData = req.body;

  console.log(updatedData) 

  db.query('SELECT * FROM "presences" WHERE "idpre" = $1',
    [updatedData.ID],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de la récupération de la présence :", err);
        return res.status(500).send({
          msg: "Erreur lors de la récupération de la présence" 
        });
      }
      

      if (result.rowCount === 1) {
        db.query(
          'UPDATE "presences" SET "depart" = $1, "arrive" = $2 WHERE "idpre" = $3',    
          [updatedData.HEURE_DEPART, updatedData.HEURE_ARRIVER, updatedData.ID],
          (err, result) => {
            if (err) {
              console.error("Erreur lors de la mise à jour de la présence :", err);
              return res.status(500).send({ 
                msg: "Erreur lors de la mise à jour de la présence"
              });
            } else {
              return res.status(200).json({
                msg: "Mise a jour effectuee",
                updatedData: updatedData
              });
            }
          }
        );
      } else {
        return res.status(404).json({
          msg: "Mise à jour annulée !",
          updatedData: updatedData
        });
      }
    }
  );
});

module.exports = router;