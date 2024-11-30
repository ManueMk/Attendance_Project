const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware");

router.post("/conge", authMiddleware, (req, res, next) => {
  const division = req.body.DIVISION;
  const dateA = new Date(req.body.DATEARRIVER);
  const dateD = new Date(req.body.DATEDEPART);

  db.query(
    `SELECT "p"."id_con", "p"."matricule", "agt"."nom", "agt"."prenom", "p"."date_per", "p"."date_retour", "p"."type", "agt"."division, p.accord"
    FROM "conges" "p"
    INNER JOIN "agt" ON "p"."matricule" = "agt"."matricule"
    WHERE "p"."isaccepted" != $4 AND "agt"."division" = $3 AND ( "p"."date_per" BETWEEN $1::date AND $2::date OR "p"."date" BETWEEN $1::date AND $2::date) ORDER BY "p"."date_per" DESC;`,
    [dateA, dateD, division, 1],
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log(result)

      if (result.rowCount === 0) {
        return res.status(200).json({
          msg: `le tableau des permissions entre ${dateA} et ${dateD} est vide !!`,
          conges: [
            {
              MATRICULE: "",
              NOM: "",
              PRENOM: "",
              DATE_PER: "",
              DATE_RETOUR: "",
              TYPE: "",
              DIVISION: "",
              ACCORD: "",
            },
          ],
        });
      } else {
        return res.status(200).json({
          conges: result.rows,
        });
      }
    }
  );
});

module.exports = router;