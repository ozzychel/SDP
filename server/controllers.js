const Model = require('./models');

const getHotel = (req, res) => {
  console.log('CONTROLLER: getHotel() params:', req.params)
  Model.getHotel('', (err, data) => {
    if (err) res.status(400).send();
    else res.status(200).send(data);
  })
};

module.exports = {
  getHotel
};