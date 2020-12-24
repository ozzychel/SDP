const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const csvWriter = require('csv-write-stream');

// scecify path to store generated CSV files
const OUTPUT_PATH = path.join(__dirname, '../../../', 'data', 'postgresData');

counters = {
  hotel: 0,
  room: 0,
  guest: 0,
  rate: 0,
  booking: 0
}


/*-------------------------------------------------------
  == HELPERS ==
--------------------------------------------------------*/
// creates random number(min, max)
const randomNumber = (min, max) => Math.floor(min + Math.random() * (max - min));

// creates random price, with possibility of null (service doesn't have a quote for this room)
const randomPrice = (min, max) => {
  const temp = min + Math.random() * (max - min);
  return temp < min * 1.1 || temp > max * 0.9 ? null : temp;
};

// generate checkIn adding random number of days to now()
const getCheckIn = (hash) => {
  let totalDays = moment().isLeapYear() ? 366 : 365;
  let num = randomNumber(1, totalDays - 15);
  return moment().add(num, 'days').format('YYYY-MM-DD HH:mm:ss')
};

// generate checkOut adding 1..14 number of days to checkIn (14 days - max stay)
const getCheckOut = (date) => {
  let num = randomNumber(1, 14);
  return moment(date).add(num, 'days').format('YYYY-MM-DD HH:mm:ss');
};

// randomly select room id, ensure uniqueness
const getRoomId = (rooms, hash, min, max) => {
  let num;
  do{ num = randomNumber(min, max) } while (hash[num])
  return num;
};


/*-------------------------------------------------------
  == DATA GENERATORS ==
--------------------------------------------------------*/

// create hotel data, takes number of desired data as 1st param,
// number of rooms per each hotel as 2nd param (for the sake of data calculation is set to 50)
const createHotel = (numOfData = 3, rooms = 50) => {
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
const createGuest = (numOfData = 50) => {
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

const createRooms = (hotels) => {
  if(!hotels.length) return null;
  const generatedData = [];
  hotels.forEach((hotel, ind) => {
    let start = counters.room;
    for (let i = start + 1; i <= start + hotel.rooms_total; i++) {
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
const createRoomRate = (rooms) => {
  if(!rooms.length) return null;
  const generatedData = [];
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

    for (let i = 0; i < 3; i++) {
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
  return generatedData;
};

// create bookings data, for the sake of simplicity each guest has a booking
// for a separate room, to avoid date collision
const createBooking = (guests, rooms) => {
  if(!guests.length || !rooms.length) return null;
  if(rooms.length < guests.length) {
    console.log('Invalid configuration: guests number should be <= rooms number');
    return null;
  }
  let min = +Infinity;
  let max = -Infinity;
  const generatedData = [];
  const hash = {};

  // determine min and max room id
  rooms.forEach((room) => {
    min = Math.min(min, room.id);
    max = Math.max(max, room.id);
  })

  guests.forEach((guest) => {
    // get roomId, checkIn and checkOut, ensure data is unique
    let roomId = getRoomId(rooms, hash, min, max);
    let checkIn = getCheckIn();
    let checkOut = getCheckOut(checkIn);
    let booking = {
      id: counters.booking + 1,
      guest_id: guest.id,
      room_id: roomId,
      check_in: checkIn,
      check_out: checkOut
    }
    hash[booking.room_id] = true;
    generatedData.push(booking);
    counters.booking++;
  })
  return generatedData;
};


/*-------------------------------------------------------
  == DRIVER FUNCTIONS ==
--------------------------------------------------------*/

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

  // create


  writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/out.csv`))
  writer.write({hello: "1", foo: "2", baz: "3"})
  writer.end();
};


/*-------------------------------------------------------
  == TESTING ==
--------------------------------------------------------*/
const test = () => {
  const hotels = createHotel(3, 5);
  const rooms = createRooms(hotels);
  const rates = createRoomRate(rooms);
  const guests = createGuest(14);
  const bookings = createBooking(guests, rooms);

  console.log(bookings)
}

test()
console.log(counters)