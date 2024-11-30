const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const {
  suprimerValidation,
} = require("../validation");
const authMiddleware = require("../authMiddleware");

router.put("/suprimerPer", authMiddleware,(req, res) => {

    const updatedData = req.body;

    console.log(req.body)
    // return res.status(400).send({
    //   msg: err,
    // });
  
    db.query(
      `UPDATE permision
    SET "isaccepted" = $1 
      WHERE "id_per" = $2`,[1,updatedData.ID],
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
