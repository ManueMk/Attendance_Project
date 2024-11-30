const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware");

router.post("/all_admin", authMiddleware, (req, res, next) => {
  db.query(
    `SELECT "a"."id_ad", "a"."matricule", "a"."Access", "agt"."nom", "agt"."division"
    FROM "admin" "a"
    INNER JOIN "agt" ON "a"."matricule" = "agt"."matricule"
    WHERE "a"."Access"= 'Restricted';`,

    
    (err, result) => {
  
      // user does not exists
      if (err) {
        throw err;
      }

      if (result.rowCount === 0) {
        return res.status(404).json({
          msg: `le tableau des admin !`,
        });
      } else {
        return res.status(200).json({
          admin: result.rows,
        });
      }
    }
  );
});

module.exports = router;