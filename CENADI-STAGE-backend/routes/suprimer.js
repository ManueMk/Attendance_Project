const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const {
  suprimerValidation,
} = require("../validation");
const authMiddleware = require("../authMiddleware");



router.put("/suprimer", authMiddleware,(req, res) => {
  // const ID = req.params.ID; // Les données POST sont disponibles dans req.Id
  const updatedData = req.body;

  console.log(req.body)

  db.query(
    `UPDATE presences
  SET "isdeleted" = $1 
    WHERE "idpre" = $2`,[1,updatedData.ID],
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err,
        });
      } else {
        return res.status(200).json({
          msg: "suprimmer avec succes!",
        });
      }
    }
  );
});



module.exports = router;
