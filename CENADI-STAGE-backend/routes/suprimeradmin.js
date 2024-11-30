const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const authMiddleware = require("../authMiddleware");


router.delete("/suprimeradmin/:id_ad", authMiddleware, (req, res) => {
  const id = req.params.id;

  db.query(
    `DELETE FROM admin
     WHERE "id_ad" = $1`,
    [id],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de la suppression :", err);
        return res.status(400).json({
          msg: err,
        });
      } else {
        return res.status(200).json({
          msg: "Suppression réussie!",
        });
      }
    }
  );
});

module.exports = router;