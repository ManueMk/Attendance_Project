const express = require("express");
const router = express.Router();
const pool = require("../dbConnection"); // Utilisez le module pg pour la connexion à la base de données
const { loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Middleware d'authentification

router.post("/login", loginValidation, (req, res, next) => {
  pool.query(
    `SELECT * FROM "admin" WHERE "matricule"= $1;`, // Utilisez des paramètres en tant que valeurs dynamiques dans la requête
    [req.body.MATRICULE],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err.message,
        });
      }

      if (result.rows.length === 0) {
        return res.status(401).send({
          msg: "Le matricule ou le mot de passe est incorrect",
        });
      }

      bcrypt.compare(
        req.body.PASSWORD,
        result.rows[0]["password"],
        (bErr, bResult) => {
          if (bErr) {
            return res.status(401).send({
              msg: "Le matricule ou le mot de passe est incorrect", 
            });
          }
          if (bResult) {
            const accessToken = jwt.sign(
              { id: result.rows[0].id },
              "the-super-strong-secrect",
              { expiresIn: "1H" }
            );

            const refreshToken = jwt.sign(
              { id: result.rows[0].id },
              "the-super-strong-secrect",
              { expiresIn: "1H" } 
            );

            return res.status(200).send({
              msg: "Connexion réussie!",
              accessToken,
              refreshToken,
              user: result.rows[0],
              
            });
          }
          return res.status(401).send({
            msg: "Le matricule ou le mot de passe est incorrect!",
          });
        }
      );
    }
  );
});

module.exports = router;
