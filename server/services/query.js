const pool = require('../db/db');

// Fonction pour exécuter une requête SQL
async function query(sql, params) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

module.exports = query;
