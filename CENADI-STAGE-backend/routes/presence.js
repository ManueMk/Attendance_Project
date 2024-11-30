const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware");

router.post("/presence", authMiddleware, (req, res, next) => {
  const division = req.body.DIVISION;
  const dateA = new Date(req.body.DATEARRIVER);
  const dateD = new Date(req.body.DATEDEPART);
  db.query(
    `SELECT "presences"."idpre", "presences"."matricule", "agt"."nom", "agt"."prenom", "presences"."date", "presences"."arrive", "presences"."depart", "agt"."division"
    FROM "presences"
    INNER JOIN "agt" ON "presences"."matricule" = "agt"."matricule"
    WHERE "agt"."division" = $1 AND "presences"."isdeleted" = $2 AND "presences"."date" BETWEEN $3 AND $4
    GROUP BY "presences"."idpre", "presences"."matricule", "agt"."nom", "agt"."prenom", "presences"."date", "presences"."arrive", "presences"."depart", "agt"."division"
    ORDER BY "presences"."idpre" DESC`,
    [division, 0, dateA, dateD],
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
          msg: `Toutes les presences entre ${dateA} et ${dateD} pour la division ${division}`,
          user: result.rows,
        });
      }
    }
  );
});

module.exports = router;