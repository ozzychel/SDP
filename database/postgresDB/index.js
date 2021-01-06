const conf = require('../../config')
const { Pool } = require('pg');

const pool = new Pool({
  host: conf.psql_host,
  port: '5432',
  user: conf.psql_user,
  password: conf.psql_pass,
  database: 'calendar',
});

// test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.log('FAILED TO CONNECT', err);
  if (res) console.log('DB CONNECTED');
});

module.exports.pool = pool;