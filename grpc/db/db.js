const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'library',
  password: 'password',
  port: 5432,
});

module.exports = pool;
