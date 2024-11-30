const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const { form_presenceValidation } = require("../validation");
const authMiddleware = require("../authMiddleware");
router.post(
  "/matricule",
  form_presenceValidation,
  authMiddleware,
  (req, res) => {
    const data = req.body;
    const { MATRICULE, PASSWORD } = req.body;

    db.query(
      `SELECT * FROM "agt"
  WHERE "matricule" = $1`,
      [data.MATRICULE],
      (err, result) => {
        if (err) {
          console.error("Erreur lors de la récupération des données :", err);
          return res.status(401).send({
            msg: "Erreur lors de la récupération des données",
          });
        }

        if (result.rowCount === 0) {
          return res.status(404).send({
            msg: "Le matricule n'a pas été reconnu",
          });
        } else {
          return res.status(200).send({
            msg: "ok",
            data: result.rows[0],
          });
        }
      }
    );
  }
);

module.exports = router;
