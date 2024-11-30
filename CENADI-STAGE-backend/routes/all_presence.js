const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware"); // Assurez-vous d'importer correctement authMiddleware

router.post("/all_presence", authMiddleware, (req, res, next) => {
  const dateA = new Date(req.body.DATEARRIVER); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
  const dateD = new Date(req.body.DATEDEPART); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'


  db.query(
    `SELECT "presences"."idpre", "presences"."matricule", "agt"."nom", "agt"."prenom", "presences"."date", "presences"."arrive", "presences"."depart", "agt"."division"
     FROM "presences"
     INNER JOIN "agt" ON "presences"."matricule" = "agt"."matricule"
     WHERE "presences"."isdeleted" = $3 AND "presences"."date" BETWEEN $1 AND $2
     ORDER BY "presences"."idpre" DESC`,

    [dateA, dateD, 0],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length === 0) {
        return res.status(401).send({
          msg: "le tableau est vide!",
        });
      } else {
        return res.status(200).send({
          msg: `Toutes les presences entre entre ${dateA} et ${dateD}`,
          user: result.rows,
        });
      }
    }
  );
});

module.exports = router;
