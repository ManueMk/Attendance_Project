const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware");

router.put("/acceptPermission/:id", authMiddleware, (req, res, next) => {
  const ID = req.params.id;

  db.query(
    `SELECT * FROM "agt" WHERE "chef" = $1 AND "matricule" = $2`,
    [1, req.body.matricule],
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
      }

      if (result.rowCount === 0) {
        return res.status(404).send({
          msg: "le tableau est vide!",
        });
      } else {
        db.query(
          `UPDATE permision
            SET "ISACCEPTED" = $1 
            WHERE "ID_PER" = $2;`,
          [1, ID],
          (err, result) => {
            // user does not exists
            if (err) {
              return res.status(404).send({
                msg: "le tableau est vide!",
              });
              throw err;
            } else {
              return res.status(200).send({
                msg: `La permission ${ID} a été acceptée !`,
              });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
