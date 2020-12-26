const express = require('express');
const app = express();
const port = 9000;
const morgan = require('morgan');
const parser = require('body-parser');
const cors = require('cors');
const db = require('../database/postgresDB/index.js');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Controllers = require('./controllers');

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  app.use(parser.json());
  app.use(cors());
  app.use(express.static('public'));
  app.use(morgan('dev'));

  app.get('/api/calendar/hotels/:hotelId', (req, res) => {
    Controllers.getHotel(req, res);
  });

  app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));
}