const Model = require('./models');

const getHotel = async (req, res) => {
  let query = `SELECT * FROM hotel JOIN room ON hotel.id=room.hotel_id JOIN room_rate ON room.id=room_rate.room_id WHERE hotel.id = ${req.params.hotelId} AND room_rate.day_date = '${req.query.check_in}' ORDER BY room.id ASC, price ASC`
  Model.getHotel(query, (err, data) => {
    if (err) res.status(400).send();
    if (data) res.status(200).send(data);
  })
};

module.exports = {
  getHotel
};