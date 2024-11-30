const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const { signUpValidation, updatepeValidation} = require("../validation");
const { validationResult } = require("express-validator");
const authMiddleware = require('../authMiddleware');
router.put("/updatepe",updatepeValidation, authMiddleware,(req, res) => {
  const matricule = req.body.MATRICULE;
  const date = req.body.DATE_PER;
  
  const updatedData = req.body;

  console.log(req.body)

  db.query(`SELECT * FROM "permision" WHERE  "id_per" = $1 `, 
  [updatedData.ID],
          (err, result) => {
            if (err) {
              throw err; 
            }
             
            if (result.rowCount === 1) {

              db.query(
                `UPDATE permision SET "motif" = $1, "date_retour" = $2, "date" = $3, "date_per" = $4  WHERE  "id_per" = $5 ;`,
                [updatedData.MOTIF, updatedData.DATE_RETOUR, updatedData.DATE, updatedData.DATE_PER, updatedData.ID],
                (err, result) => {
                  if (err) {
                    console.error("Erreur lors de la mise à jour de la présence :", err);
                    return res.status(401).json({
                      msg: "Erreur lors de la mise à jour de la permision",
                    });
                  } else if (result.affectedRows === 0) {
                    return res.status(401).json({
                      msg: "Aucune permision trouvée pour le matricule et la date spécifiés",
                    });
                  } else {
                    console.log("Permision mise à jour avec succès"); 
                    return res.status(200).json({
                      msg: "Permision mise à jour !",
                      updatedData: updatedData,
                    });
                  }
                }
              );
            }else{
              return res.status(404).json({
                msg: "Mise a jour annulee !",
                updatedData: updatedData,
              });
            }
          });
  
});


module.exports = router;
