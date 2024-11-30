const express = require("express");
const router = express.Router();
const db = require("../dbConnection");

router.get("/agt", (req, res, next) => {
  db.query(`SELECT * FROM "agt" ORDER BY "nom" ASC;`, (err, result) => {
    // user does not exists
    if (err) {
      throw err;
      return res.status(400).send({
        msg: err,
      });
    }
    if (!result.rowCount) {
      return res.status(401).send({
        msg: "le tableau est vide!",
      });
    } else {
      return res.status(200).send({
        msg: "Tous les utilisateurs!",
        user: result.rows,
      });
    }
  });
});

module.exports = router;
