const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const csvWriter = require('csv-write-stream');

// scecify path to store generated CSV files
const OUTPUT_PATH = path.join(__dirname, '../../../', 'data', 'postgresData');
// '../../../data/postgresData';

counters = {
  hotel: 0,
  room: 0,
  guest: 0,
  rate: 0
}

// creates random number(min, max)
const randomNumber = (min, max) => Math.floor(min + Math.random() * (max - min));

// creates random price, with possibility of null (service doesn't have a quote for this room)
const randomPrice = (min, max) => {
  const temp = min + Math.random() * (max - min);
  return temp < min * 1.1 || temp > max * 0.9 ? null : temp;
};

// create hotel data, takes number of desired data as 1st param,
// number of rooms per each hotel as 2nd param (for the sake of data calculation is set to 50)
const createHotel = (numOfData, rooms=50) => {
  const generatedData = [];
  let start = counters.hotel;
  for (let i = start + 1; i <= start + numOfData; i++) {
    let hotel = {
      id: i,
      title: faker.lorem.sentence(),
      address: '',
      zip_code: '',
      url: faker.internet.url(),
      rating: parseFloat((1 + Math.random() * (5 - 1)).toFixed(2)),
      reviews_total: randomNumber(0, 20000),
      rooms_total: rooms
    }
    let zip = faker.address.zipCode();
    let addr = faker.address.streetAddress() + ', ' + faker.address.stateAbbr() + ', ' + zip;
    hotel.address = addr;
    hotel.zip_code = zip;
    generatedData.push(hotel);
    counters.hotel ++;
  }
  return generatedData;
};

// create guest data, takes number of desired data as 1st param
const createGuest = (numOfData) => {
  const generatedData = [];
  let start = counters.guest;
  for (let i = start + 1; i <= start + numOfData; i++) {
    let guest = {
      id: i,
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumberFormat()
    }
    generatedData.push(guest);
  }
  counters.guest += numOfData;
  return generatedData;
};

// create room data, takes number of desired hotels and desired number of rooms per hotel
const createRooms = (numOfHotels = counters.hotel, roomsPerHotel = 50) => {
  const hotels = createHotel(numOfHotels, roomsPerHotel)
  const generatedData = [];
  hotels.forEach((hotel, ind) => {
    let start = counters.room;
    for (let i = start + 1; i <= start + roomsPerHotel; i++) {
      let room = {
        id: i,
        hotel_id: hotel.id
      }
      generatedData.push(room);
      counters.room++;
    }
  })
  return generatedData;
};

// creates rate for 10 different services, per each day of the year, for every room generated
const createRoomRate = (numOfHotels = counters.hotel, roomsPerHotel = 50) => {
  const generatedData = [];
  const rooms = createRooms(numOfHotels, roomsPerHotel);
  const serviceList = [
    {id:1, title: 'Hotels.com'},
    {id:2, title: 'Expedia.com'},
    {id:3, title:'Snaptravel'},
    {id:4, title: 'Booking.com'},
    {id:5, title: 'Zenhotels'},
    {id:6, title: 'Orbitz.com'},
    {id:7, title: 'Prestigia'},
    {id:8, title: 'Priceline'},
    {id:9, title: 'eDreams'},
    {id:10, title: 'Tripadvisor'}
  ];
  let days = moment().isLeapYear() ? 366 : 365;
  rooms.forEach((room) => {

    for (let i = 0; i < days; i++) {
      let sqlDate = moment().add(i, 'days').format('YYYY-MM-DD HH:mm:ss')

      for(let j = 0; j < serviceList.length; j++) {
        let rate = {
          id: counters.rate + 1,
          service_id: serviceList[j].id,
          service_title: serviceList[j].title,
          price: Math.floor(randomPrice(80, 980)),
          day_Date: sqlDate,
          room_id: room.id
        }
        generatedData.push(rate);
        counters.rate++;
      }

    }

  })
  console.log(generatedData)
  return generatedData;
};

// function for creating new folder in filesystem
const createFolder = async () => {
  try{
    let folder = await fsPromises.mkdir(`${OUTPUT_PATH}`, { recursive: true })
    console.log(`++ FOLDER CREATION SUCCESS:\n${OUTPUT_PATH}`);
  } catch (err) {
    console.log(err);
  }
};

// driver function, write generated data to CSV file
const driver = async () => {
  const writer = csvWriter({ headers: ["hello", "foo"]})

  // create folder
  const folder = await createFolder();


  writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/out.csv`))
  writer.write({hello: "1", foo: "2", baz: "3"})
  writer.end();
};

driver()
console.log(counters)