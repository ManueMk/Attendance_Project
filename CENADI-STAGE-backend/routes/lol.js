//http://localhost:3000/api/assiduiter pour le calul  de l'assiduiter ca affiche le taux d'assiduiter
// et ausi ca calcul les heures sup
//http://localhost:3000/api/absence pour le calcule du taux d'absence
//http://localhost:3000/api/login pour la connexion
//http://localhost:3000/api/index pour afficher la table presence
//http://localhost:3000/api/agt pour afficher la table agt
//http://localhost:3000/api/permision pour afficher la table permision
//http://localhost:3000/api/signUp pour l'enregistrement
//http://localhost:3000/api/insertPresence POUR pouvoir  incerer une nouvelle presence
//http://localhost:3000/api/matricule POUR pouvoir verifier que le matricule existe avant incerer une nouvelle presence
//http://localhost:3000/api/10_assidus POUR AFFICHER les 10 plus assidus
//http://localhost:3000/api/absence pour afficher le taux d'assiduiter des absence
//http://localhost:3000/api/absen pour afficher le tableau d'absence par division
//http://localhost:3000/api/all_absen pour afficher tout les absent tous les all ne prennent que les dates en parametres pas de division
//http://localhost:3000/api/moin pour afficher les 10 moin assidus de chaque division
//http://localhost:3000/api/all_presence pour afficher tout les presence
//http://localhost:3000/api/chef_div pour afficher tous les chef de division
//http://localhost:3000/api/update pour modifier la table presence
//http://localhost:3000/api/all_permision pour afficher tous les permission
//http://localhost:3000/api/form_permision pour enregistrer une nouvelle permission
function authMiddleware(req, res, next) {
  // Récupérer le token d'authentification du header de la requête
  const token = req.headers.authorization;

  // Vérifier si le token existe
  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé. Token manquant." });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, "the-super-strong-secrect");

    // Ajouter les informations de l'utilisateur à la requête pour une utilisation ultérieure
    req.user = decoded;

    // Passer à l'étape suivante
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé. Token invalide." });
  }
}
// var mysql = require('mysql');
// var conn = mysql.createConnection({
//   host: 'localhost', // Replace with your host name
//   user: 'root',      // Replace with your database username
//   password: '',      // Replace with your database password
//   database: 'cenad' // // Replace with your database Name
// });

// conn.connect(function(err) {
//   if (err) throw err;
//   console.log('Database is connected successfully !');
// });
// module.exports = conn;
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "12345",
  host: "localhost",
  port: 5432, // Remplacez par le port de votre base de données
  database: "cenad",
});

pool.connect((err, client, release) => {
  if (err) {
    throw err;
  }
  console.log("Connected to PostgreSQL database");

  // Ici vous pouvez exécuter des requêtes SQL ou effectuer d'autres opérations sur la base de données

  release(); // Libère le client pour le retourner au pool
});

module.exports = pool;
