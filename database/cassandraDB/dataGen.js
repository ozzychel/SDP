const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const csvReader = require('csv-parser');
const csvWriter = require('csv-write-stream');

// scecify path to store generated CSV files
const OUTPUT_PATH = path.join(__dirname, '../../../', 'data', 'cassandraData');