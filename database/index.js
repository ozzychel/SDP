const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};

mongoose.connect('mongodb://localhost/hotellist', option); // 172.17.0.2
const db = mongoose.connection;

//Test connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DATABASE CONNECTED!');
});

const hotelSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  hotelName: String,
  roomsTotal: Number,
  maxGuestPerRoom: Number,
  vacancy: [ {date: String, isBooked: Boolean} ],
  prices: [ {serviceName: String, price: Number} ]
});

const HotelClass = mongoose.model('hotels', hotelSchema);

module.exports.model = HotelClass;
module.exports.connection = db;

