const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const csvReader = require('csv-parser');
const csvWriter = require('csv-write-stream');

// scecify path to store generated CSV files
const OUTPUT_PATH = path.join(__dirname, '../../../', 'data', 'cassandraData');

// set up this config to specify desired amount of data to be generated
// 1000 hotels * 50 rooms/hotel generates 180 mil lines of data
// 100 hotels * 50 rooms/hotel generates 18 mil lines of data
const config = {
  HOTELS_TOTAL: 1000, // total hotels to create
  ROOMS_PER_HOTEL: 5, // number of rooms per 1 hotel
  GUESTS_TOTAL: 2500, // total guests to create
  DAYS_CREATE_RATE: 5, // number of days from today to create rate (massive!!!)
  NUMBER_OF_RATE_FILES: 10 // number of .csv file to split created rates
}

// count generated data
const counters = {
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
  return moment().add(num, 'days').format('YYYY-MM-DD')
};

// generate checkOut adding 1..14 number of days to checkIn (14 days - max stay)
const getCheckOut = (date) => {
  let num = randomNumber(1, 14);
  return moment(date).add(num, 'days').format('YYYY-MM-DD');
};

// randomly select room id, ensure uniqueness
const getRoomId = (rooms, hash, min, max) => {
  let num;
  do{ num = randomNumber(min, max) } while (hash[num])
  return num;
};

/*-------------------------------------------------------
  == DATA GENERATING FUNCTIONS ==
--------------------------------------------------------*/
// creates random hotel
const createHotel = (roomsNum) => {
  let hotel = {
    title: faker.lorem.sentence(),
    zip_code: faker.address.zipCode(),
    address: '',
    url: faker.internet.url(),
    rating: parseFloat((1 + Math.random() * (5 - 1)).toFixed(2)),
    reviews_total: randomNumber(0, 20000),
    rooms_total: roomsNum
  }
  hotel.address = faker.address.streetAddress() + ', ' + faker.address.stateAbbr() + ', ' + hotel.zip_code
  counters.hotel++;
  return hotel;
};

// creates random guest
const createGuest = () => {
  let guest = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat()
  }
counters.guest++;
return guest;
};

// creates rate for 10 different services, per each day of the year
const createRoomRate = (room, hotel) => {
  if(!room) return null;
  const generatedData = [];
  const serviceList = [
    {id:1, title: 'Hotels.com'},
    {id:2, title: 'Expedia.com'},
    {id:3, title: 'Snaptravel'},
    {id:4, title: 'Booking.com'},
    {id:5, title: 'Zenhotels'},
    {id:6, title: 'Orbitz.com'},
    {id:7, title: 'Prestigia'},
    {id:8, title: 'Priceline'},
    {id:9, title: 'eDreams'},
    {id:10, title: 'Tripadvisor'}
  ];

    for (let i = 0; i < config.DAYS_CREATE_RATE; i++) {
      let sqlDate = moment().add(i, 'days').format('YYYY-MM-DD')
      for(let j = 0; j < serviceList.length; j++) {
        let rate = {
          hotel_id: hotel.hotel_id,
          title: hotel.title,
          zip_code: hotel.zip_code,
          address: hotel.address,
          url: hotel.url,
          rating: hotel.rating,
          reviews_total: hotel.reviews_total,
          rooms_total: hotel.rooms_total,
          room_id: room.room_id,
          room_beds: room.room_beds,
          rate_id: counters.rate + 1,
          service_id: serviceList[j].id,
          service_title: serviceList[j].title,
          price: Math.floor(randomPrice(80, 980)),
          day_Date: sqlDate,
        }
        generatedData.push(rate);
        counters.rate++;
      }
    }
  return generatedData;
};

// create hotel booking for every guest
const createBooking = (rooms, guests, hotels) => {
  if(!guests.length || !rooms.length || !hotels.length) return null;
  if(rooms.length < guests.length) {
    console.log('Invalid configuration: guests number should be <= rooms number');
    return null;
  }
  let min = +Infinity;
  let max = -Infinity;
  const generatedData = [];
  const hash = {};

  rooms.forEach((room) => {
    min = Math.min(min, room.room_id);
    max = Math.max(max, room.room_id);
  })

  guests.forEach((guest) => {
    let roomId = getRoomId(rooms, hash, min, max);
    let checkIn = getCheckIn();
    let checkOut = getCheckOut(checkIn);
    let room = rooms.filter(room => room.room_id === roomId)[0];
    let hotelId = room.hotel_id;
    let hotel = hotels.filter(hotel => hotel.hotel_id === hotelId)[0];
    let booking = {
      booking_id: counters.booking + 1,
      guest_id: guest.guest_id,
      guest_firstname: guest.first_name,
      guest_lastname: guest.last_name,
      guest_email: guest.email,
      guest_phone: guest.phone,
      guest_qty: randomNumber(1, 10),
      check_in: checkIn,
      check_out: checkOut,
      hotel_id: hotel.hotel_id,
      hotel_title: hotel.title,
      hotel_url: hotel.url,
      hotel_address: hotel.address,
      hotel_zipcode: hotel.zip_code,
      room_id: roomId,
      room_beds: room.room_beds,
    }
    hash[booking.room_id] = true;
    generatedData.push(booking);
    counters.booking++;
  })
  return generatedData;
};

/*-------------------------------------------------------
  == READ/WRITE FUNCTIONS ==
--------------------------------------------------------*/
// write hotels to .csv
const writeToHotelCSV = (writer, { HOTELS_TOTAL, ROOMS_PER_HOTEL }) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    let id = counters.hotel;
    writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/hotel.csv`))
    function write() {
      let ok = true;
      do {
        id += 1;
        let data = createHotel(ROOMS_PER_HOTEL);
        data['hotel_id'] = id;
        if (i === HOTELS_TOTAL - 1) {
          console.log(`+++ HOTELS: created ${HOTELS_TOTAL} lines`)
          writer.write(data, () => {
            writer.end();
            resolve(true);
          });
          i++;
        } else {
          ok = writer.write(data);
          i++
        }
    } while (i < HOTELS_TOTAL && ok);
    if (i < HOTELS_TOTAL) {
      writer.once('drain', write);
    }
  }
  write();
  })
};

// write guests to .csv
const writeToGuestsCSV = (writer, { GUESTS_TOTAL }) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    let id = counters.guest;
    writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/guest.csv`))
    function write() {
      let ok = true;
      do {
        id += 1;
        let data = createGuest();
        data['guest_id'] = id;
        if (i === GUESTS_TOTAL - 1) {
          console.log(`+++ GUESTS: created ${GUESTS_TOTAL} lines`)
          writer.write(data, () => {
            writer.end();
            // console.log(counters)
            resolve(true);
          });
          i++;
        } else {
          ok = writer.write(data);
          i++;
        }
      } while (i < GUESTS_TOTAL && ok);
      if (i < GUESTS_TOTAL) {
        writer.once('drain', write);
      }
    }
    write();
  })
};

// write rooms to .csv
const writeToRoomsCSV = (writer, arr) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    let id = counters.room + 1;
    let roomsTotal = arr[0].rooms_total;
    writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/room.csv`))

    function write() {
      let ok = true;
      do {
        if (i === arr.length - 1) {
          for(let j = 0; j < roomsTotal; j++) {
            let data = {
              room_id: id,
              room_beds: randomNumber(1,15),
              hotel_id: arr[i].hotel_id
            }
            id++;
            counters.room++;
            writer.write(data);
          }
          i++;
          console.log(`+++ ROOMS: created ${id - 1} lines`)
          writer.end();
          resolve(true);
        } else {
          for(let j = 0; j < roomsTotal; j++) {
            let data = {
              room_id: id,
              room_beds: randomNumber(1,15),
              hotel_id: arr[i].hotel_id
            }
            data.beds = randomNumber(1,15)
            ok = writer.write(data);
            id++;
            counters.room++;
          }
          i++;
        }
      } while (i < arr.length && ok);
      if (i < arr.length) {
        writer.once('drain', write);
      }
    }
    write();
  })
};

// write bookings to .csv
const writeToBookingCSV = (writer, roomsArr, guestsArr, hotelsArr) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/booking.csv`));
    function write () {
      let ok = true;
      do{
        let data = createBooking(roomsArr, guestsArr, hotelsArr)
        if(i === 0) {
          for(let j = 0; j < data.length; j++) {
            ok = writer.write(data[j]);
          }
          writer.end();
          resolve(true);
          i++;
        } else {
          ok = writer.write(data);
          i++;
        }
      } while (i < 1 && ok)
      if(i < 1) {
        writer.once('drain', write)
      }
    }
    write();
  })
};

// reads hotel.csv and extracts data
const readFromHotelCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const extractedData = [];
    fs.createReadStream(filename)
      .pipe(csvReader({
        mapValues: ({ header, index, value }) => {
          if (header === 'hotel_id' || header === 'rooms_total'
          || header === 'reviews_total') return parseInt(value);
          else if(header === 'rating') return parseFloat(value);
          else return value;
        }
      }))
      .on('data', (row) => {
        extractedData.push(row);
      })
      .on('end', () => {
        console.log(`+++ READ_HOTELS: hotel data extracted ${extractedData.length} lines`);
        resolve(extractedData);
      });
    })
};

// reads room.csv and extracts data
const readFromRoomCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const extractedData = [];
    fs.createReadStream(filename)
      .pipe(csvReader({
        mapValues: ({ header, index, value }) => {
          return parseInt(value);
        }
      }))
      .on('data', (row) => {
        extractedData.push(row);
      })
      .on('end', () => {
        console.log(`+++ READ_ROOMS: room data extracted ${extractedData.length} lines`);
        resolve(extractedData);
      });
  })
};

// reads guest.csv and extracts data
const readFromGuestCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const extractedData = [];
    fs.createReadStream(filename)
      .pipe(csvReader({
        mapValues: ({ header, index, value }) => {
          if(header === 'guest_id') return parseInt(value);
          else return value;
        }
      }))
      .on('data', (row) => {
        extractedData.push(row);
      })
      .on('end', () => {
        console.log(`+++ READ_GUESTS: guest data extracted ${extractedData.length} lines`);
        resolve(extractedData);
      });
  })
}

// write roomRates to .csv
const writeToRatesCSV = (writer, arr, hotels, fileNum) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/roomRate${fileNum}.csv`));
    function write () {
      let ok = true;
      do{
        let hotel = hotels.filter(elem => elem.hotel_id === arr[i].hotel_id)
        let data = createRoomRate(arr[i], hotel[0]);
        if(i === arr.length - 1) {
          for (let j = 0; j < data.length; j++) {
            ok = writer.write(data[j]);
          }
          writer.end();
          resolve(true);
          i++;
        } else {
          for (let j = 0; j < data.length; j++) {
            ok = writer.write(data[j]);
          }
          i++;
        }
      } while (i < arr.length && ok)
      if(i < arr.length) {
        writer.once('drain', write)
      }
    }
    write();
  })
};


/*-------------------------------------------------------
  == DRIVER FUNCTIONS ==
--------------------------------------------------------*/
// creates new folder in filesystem
const createFolder = async () => {
  try{
    let folder = await fsPromises.mkdir(`${OUTPUT_PATH}`, { recursive: true })
    console.log(`+++ FOLDER: new folder created:\n${OUTPUT_PATH}`);
  } catch (err) {
    console.log(err);
  }
};

const driver = async () => {
  // create folder
  const folder = await createFolder();

  // create hotels
  const writeHotels = csvWriter({ headers: ['hotel_id', 'title', 'zip_code', 'address', 'url', 'rating', 'reviews_total', 'rooms_total'] });
  const hotels = await writeToHotelCSV(writeHotels, config);

  // extract data from hotels
  const dataFromHotelCSV = await readFromHotelCSV(`${OUTPUT_PATH}/hotel.csv`);

  // create guests
  const writeGuests = csvWriter({ headers: ['guest_id', 'first_name', 'last_name', 'email', 'phone'] });
  const guests = await writeToGuestsCSV(writeGuests, config);

  // extract data from guests
  const dataFromGuestCSV = await readFromGuestCSV(`${OUTPUT_PATH}/guest.csv`);

  // create rooms
  const writeRooms = csvWriter({ headers: ['room_id', 'room_beds', 'hotel_id'] });
  const rooms = await writeToRoomsCSV(writeRooms, dataFromHotelCSV);

  // extract data from rooms
  const dataFromRoomCSV = await readFromRoomCSV(`${OUTPUT_PATH}/room.csv`);

  // create room_rates
  const leng = dataFromRoomCSV.length;
  const chunkSize = Math.floor(leng / config.NUMBER_OF_RATE_FILES);
  let currentNum = 1;

  for (let i = 0; i < leng; i += chunkSize) {
    let writeRoomRates = csvWriter({ headers: ['hotel_id','title', 'zip_code', 'address', 'url', 'rating', 'reviews_total', 'rooms_total', 'room_id', 'room_beds', 'rate_id', 'service_id', 'service_title', 'price', 'day_Date']})
    let chunk = dataFromRoomCSV.slice(i, i + chunkSize)
    let roomRates = await writeToRatesCSV(writeRoomRates, chunk, dataFromHotelCSV, currentNum);
    currentNum++;
  }

  // create bookings
  const writeBookings = csvWriter({ headers: ['booking_id','guest_id', 'guest_firstname', 'guest_lastname', 'guest_email', 'guest_phone', 'guest_qty', 'check_in', 'check_out', 'hotel_id', 'hotel_title', 'hotel_url', 'hotel_address', 'hotel_zipcode', 'room_id', 'room_beds'] });
  const bookings = await writeToBookingCSV(writeBookings, dataFromRoomCSV, dataFromGuestCSV, dataFromHotelCSV);

  console.log('\n','TOTAL DATA GENERATED:', counters, '\n')
};

driver()