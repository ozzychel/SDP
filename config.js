const path = require('path');
/*-------------------------------------------------------------------------------------------------
  POSTGRES DATABASE CREDENTIALS
-------------------------------------------------------------------------------------------------*/
// for local testing set host as 'localhost', type in user and password for postgres
const psql_host = 'localhost';
const psql_user = PUT_YOUR_USERNAME_HERE;
const psql_pass = PUT_YOUR_PASSWORD_HERE;

/*-------------------------------------------------------------------------------------------------
  MOCK DATA_GENERATOR CONFIG
-------------------------------------------------------------------------------------------------*/
// Please be careful with below configuration as it creates a massive amount of data
// e.g. 1000 hotels, 50 rooms/hotel and 365 days generates 180 mil lines of data (>10Gb)
const HOTELS_TOTAL = 1000; // total hotels to create
const ROOMS_PER_HOTEL = 10; // number of rooms per 1 hotel
const GUESTS_TOTAL = 1000; // total guests to create
const DAYS_CREATE_RATE = 5; // number of days from today to create rate (massive!!!)

// Specify path to store generated data, folder will be created automatically
const OUTPUT_PATH = path.join(__dirname, '../', 'data', 'postgresData')

module.exports = {
  psql_host,
  psql_pass,
  psql_user,
  HOTELS_TOTAL,
  ROOMS_PER_HOTEL,
  GUESTS_TOTAL,
  DAYS_CREATE_RATE,
  OUTPUT_PATH
}