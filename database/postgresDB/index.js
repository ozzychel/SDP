const { Pool } = require('pg');
const keys = require('../../config');

const pool = new Pool({
  host: 'localhost',
  port: '5432',
  user: keys.psql_user,
  password: keys.psql_pass,
  database: 'calendar',
});

// test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.log('FAILED TO CONNECT', err);
  if (res) console.log('DB CONNECTED');
});

module.exports.pool = pool;