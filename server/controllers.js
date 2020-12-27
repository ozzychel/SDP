const Model = require('./models');

const getHotel = (req, res) => {
  Model.getHotel({hotelId:req.params.hotelId, check_in: req.query.check_in}, (err, data) => {
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
  console.log('params', req.params)
  console.log('query', req.query)
  Model.bookHotelRoom(req.params.hotelId, req.query, (err, data) => {
    if (err) res.status(400).send();
    if (data) res.status(200).send('ok');
  })
};

module.exports = {
  getHotel,
  getHotelUpdated,
  bookHotelRoom
};