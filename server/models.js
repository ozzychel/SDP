const db = require('../database/postgresDB/index');

const getHotel = (query, callback) => {
  console.log('MODELS: getHotel() invoked')
  // db.query(query, callback);
  db.pool.query('SELECT * FROM hotel WHERE id = 2')
    .then((res) => {
      console.log(res.rows)
    })
};

module.exports = {
  getHotel
};