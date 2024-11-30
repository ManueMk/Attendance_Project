const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware");

router.post("/all_permision", authMiddleware, (req, res, next) => {
  const dateA = new Date(req.body.DATEARRIVER); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
  const dateD = new Date(req.body.DATEDEPART); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'

  db.query(
    `SELECT "p"."matricule", "agt"."nom", "agt"."prenom", "p"."date_per", "p"."date_retour", "p"."motif", "agt"."division"
    FROM "permision" "p"
    INNER JOIN "agt" ON "p"."matricule" = "agt"."matricule"
    WHERE "p"."isaccepted" = $3 AND "p"."date_per" BETWEEN $1::date AND $2::date ORDER BY "p"."date_per" DESC;`,
    [dateA, dateD, 0],
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
      }

      if (result.rowCount === 0) {
        return res.status(404).send({
          msg: `le tableau des permissions entre ${dateA} et ${dateD} est vide !`,
        });
      } else {
        return res.status(200).send({
          msg: `Toutes les permissions acceptees entre ${dateA} et ${dateD}`,
          permissions: result.rows,
        });
      }
    }
  );
});

module.exports = router;
