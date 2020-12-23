const faker = require('faker');
const database = require('./index.js');
const moment = require('moment');

const randomPrice = (min, max) => {
  const temp = min + Math.random() * (max - min);
  return temp < min * 1.1 || temp > max * 0.9 ? null : temp;
};

const randomIsBooked = () => {
  const temp = Math.random();
  return temp >= 0.8 ? true : false;
};

const generateSampleData = (numberOfDataToGenerate) => {
  const sampleData = [];
  const serviceList = ['Hotels.com', 'Expedia.com', 'Snaptravel', 'Booking.com', 'Zenhotels', 'Orbitz.com', 'Prestigia', 'Priceline', 'eDreams', 'Tripadvisor'];

  for (var i = 1; i <= numberOfDataToGenerate; i++) {
    let obj = {'id': i};
    let randomHotelName = faker.random.word();
    randomHotelName = randomHotelName.split(' ').shift();
    randomHotelName = `${randomHotelName.slice(0, 1).toUpperCase() + randomHotelName.slice(1)} Hotel`;
    obj['hotelName'] = randomHotelName;
    obj['roomsTotal'] = Math.floor(45 + Math.random() * (145 - 45));
    obj['maxGuestPerRoom'] = Math.floor(2 + Math.random() * (8 - 2));
    obj['vacancy'] = [];
    for (let k = 0; k < 366; k++) {
      let entity = {};
      entity['date'] = moment('2020-12-01').add(k, 'days').format('YYYY-MM-DD');
      entity['isBooked'] = randomIsBooked();
      obj['vacancy'].push(entity);
    }
    obj['prices'] = [];
    for (let j = 0; j < serviceList.length; j++) {
      let item = {};
      item['serviceName'] = serviceList[j];
      item['price'] = Math.floor(randomPrice(120, 290));
      obj['prices'].push(item);
    }
    sampleData.push(obj);
  }
  return sampleData;
};

const generatedData = generateSampleData(100);

const insertSampleData = function(data) {
  database.model.collection.drop();
  database.model.create(data)
    .then((result) => {
      console.log(`Data insertion SUCCESS. ${result.length} items inserted.`);
      database.connection.close();
    })
    .catch((err) => console.log('Data insertion FAILED.', err));
};

insertSampleData(generatedData);
