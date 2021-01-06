const Model = require('./models');

const getHotel = (req, res) => {
  Model.getHotel(req.params, req.query, (err, data) => {
    if (err) res.status(400).send();
    if (data) res.status(200).send(data);
  })
};

const getHotelUpdated = (req, res) => {
  Model.getHotelUpdated(req.params.hotelId, req.query, (err, data) => {
    if (err) res.status(400).send();
    if (data) res.status(200).send(data);
  })
};

const bookHotelRoom = (req, res) => {
  Model.bookHotelRoom(req.params.hotelId, req.query, (err, data) => {
    if (err) res.status(400).send();
    if (data) res.status(200).send('ok');
  })
};

const deleteBooking = (req,res) => {
  Model.deleteBooking(req.params.hotelId, req.query, (err, data) => {
    if (err) res.status(400).send();
    if (data) res.status(200).send('ok');
  })
};

module.exports = {
  getHotel,
  getHotelUpdated,
  bookHotelRoom,
  deleteBooking
};