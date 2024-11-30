const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const {
  signupValidation,
  loginValidation,
  modifierValidation,
} = require("../validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../authMiddleware');
router.put("/modifier/:ID", modifierValidation,authMiddleware, (req, res) => {
    
  const ID = req.params.ID; // Les données POST sont disponibles dans req.Id
  const { nom, password,matricule } = req.body;
  //console.log(data);
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      throw err;
      return res.status(400).send({
        msg: err,
      });
    }
  db.query(
    `UPDATE  presences SET matricule = ${db.escape(
      req.body.matricule
    )}, password = ${db.escape(hash)},name = ${db.escape(
      req.body.name
    )} WHERE ID = ${db.escape(req.params.ID)};`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err,
        });
      }
      // console.log(result.length);
      if (!result.length) {
        return res.status(401).send({
          msg: "modifier avec succes!",
        });
      }

      db.end();
    }
  );
})
});

module.exports = router;
