const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const { signUpValidation, form_presenceValidation } = require("../validation");
const { validationResult } = require("express-validator");

router.get("/search", async (req, res) => {
  const context = req.query.context;
  const q = req.query.q;
  const results = []; // Tableau pour stocker les résultats de recherche

  if (context === "et") {
    // Requête pour rechercher les utilisateurs
    const sql = `SELECT * FROM presence WHERE lower(NOM) like '%${q}%' OR lower(MATRICULE) like '%${q}%'`;
    const resultats = await db.query(sql); // Exécuter la requête SQL
    results.push(...resultats.rows); // Ajouter les résultats à results
  } else if (context === "de") {
    // Requête pour rechercher les départements
    const sql = `SELECT * FROM permision WHERE lower(MATRICULE) like '%${q}%' OR lower(DATE) like '%${q}%'`;
    const resultats = await db.query(sql); // Exécuter la requête SQL
    results.push(...resultats.rows); // Ajouter les résultats à results
  } else if (context === "en") {
    // Requête pour rechercher les encadrants
    const sql = `SELECT * FROM agt WHERE lower(NOM) like '%${q}%' OR lower(PRENOM) like '%${q}%'`;
    const resultats = await db.query(sql); // Exécuter la requête SQL
    results.push(...resultats.rows); // Ajouter les résultats à results
  } else {
    return res.status(400).send("Invalid context"); // Retourner une réponse avec un code d'état 400 si le contexte est invalide
  }

  if (results.length === 0) {
    return res.send("No results found"); // Retourner une réponse avec un message si aucun résultat n'a été trouvé
  }

  // Vous pouvez ajouter votre propre logique pour traiter les résultats de recherche ici

  res.send(results); // Retourner les résultats de recherche
});

module.exports = router;
