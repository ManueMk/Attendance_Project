const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '12345',
  host: 'localhost',
  port: 5432, // Remplacez par le port de votre base de données
  database: 'cenad'
});

pool.connect((err, client, release) => {
  if (err) {
    throw err;
  }
  console.log('Connected to PostgreSQL database');

  // Ici vous pouvez exécuter des requêtes SQL ou effectuer d'autres opérations sur la base de données

  release(); // Libère le client pour le retourner au pool
});

module.exports = pool;
