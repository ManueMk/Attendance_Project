const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware");

router.post("/permissions", authMiddleware, (req, res, next) => {
  const division = req.body.DIVISION;
  const dateA = new Date(req.body.DATEARRIVER); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'
  const dateD = new Date(req.body.DATEDEPART); // Récupérer l'ID de l'employé depuis le paramètre d'URL 'id'

  db.query(
    `SELECT "p"."id_per", "p"."matricule", "agt"."nom", "agt"."prenom", "p"."date_per", "p"."date_retour", "p"."motif", "agt"."division, p.accord"
    FROM "conges" "p"
    INNER JOIN "agt" ON "p"."matricule" = "agt"."matricule"
    WHERE "p"."isaccepted" != $4 AND "agt"."division" = $3 AND ( "p"."date_per" BETWEEN $1::date AND $2::date OR "p"."date" BETWEEN $1::date AND $2::date) ORDER BY "p"."date_per" DESC;`,
    [dateA, dateD, division, 1],
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
      }

      if (result.rowCount === 0) {
        return res.status(200).json({
          msg: `le tableau des permissions entre ${dateA} et ${dateD} est vide !!`,
          permission: [
            {
              matricule: "",
              NOM: "",
              PRENOM: "",
              DATE_PER: "",
              DATE_RETOUR: "",
              MOTIF: "",
              DIVISION: "",
              ACCORD: "",
            },
          ],
        });
      } else {
        return res.status(200).json({
          permission: result.rows,
        });
      }
    }
  );
});

module.exports = router;