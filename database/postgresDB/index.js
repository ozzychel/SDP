const { Pool } = require('pg');
const keys = require('../../config');

const pool = new Pool({
  host: '54.183.165.118',
  port: '5432',
  user: 'power_user',
  password: keys.psql_pass,
  database: 'calendar',
});

// const pool = new Pool({
//   host: 'localhost',
//   port: '5432',
//   user: 'ozzy_chel',
//   password: keys.psql_pass,
//   database: 'calendar',
// });

// test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.log('FAILED TO CONNECT', err);
  if (res) console.log('DB CONNECTED');
});

module.exports.pool = pool;