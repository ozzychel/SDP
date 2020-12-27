const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const csvReader = require('csv-parser');
const csvWriter = require('csv-write-stream');

// scecify path to store generated CSV files
const OUTPUT_PATH = path.join(__dirname, '../../../', 'data', 'postgresData');

// set up this config to specify desired amount of data to be generated
// 1000 hotels * 50 rooms/hotel generates 180 mil lines of data
// 100 hotels * 50 rooms/hotel generates 18 mil lines of data

const config = {
  HOTELS_TOTAL: 100, // total hotels to create
  ROOMS_PER_HOTEL: 50, // number of rooms per 1 hotel
  GUESTS_TOTAL: 25000, // total guests to create
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
const createRoomRate = (room) => {
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
          id: counters.rate + 1,
          service_id: serviceList[j].id,
          service_title: serviceList[j].title,
          price: Math.floor(randomPrice(80, 980)),
          day_Date: sqlDate,
          room_id: room.id,

        }
        generatedData.push(rate);
        counters.rate++;
      }
    }
  return generatedData;
};

// create hotel booking for every guest
const createBooking = (rooms, guests) => {
  if(!guests.length || !rooms.length) return null;
  if(rooms.length < guests.length) {
    console.log('Invalid configuration: guests number should be <= rooms number');
    return null;
  }
  let min = +Infinity;
  let max = -Infinity;
  const generatedData = [];
  const hash = {};

  rooms.forEach((room) => {
    min = Math.min(min, room.id);
    max = Math.max(max, room.id);
  })

  guests.forEach((guest) => {
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
        data['id'] = id;
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
        data['id'] = id;
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
}

// reads hotel.csv and extracts hotel_id
const readFromHotelCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const extractedData = [];
    fs.createReadStream(filename)
      .pipe(csvReader({
        mapHeaders: ({ header, index }) => header === 'id' || header === 'rooms_total' ? header : null,
        mapValues: ({ header, index, value }) => {
          if(header === 'id' || header === 'rooms_total') return parseInt(value);
          else return 0;
        }
      }))
      .on('data', (row) => {
        extractedData.push(row);
      })
      .on('end', () => {
        console.log(`+++ READ_HOTELS: hotel_id(s) extracted ${extractedData.length} lines`);
        resolve(extractedData);
      });
    })
};

// reads room.csv and extracts room_id
const readFromRoomCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const extractedData = [];
    fs.createReadStream(filename)
      .pipe(csvReader({
        mapHeaders: ({ header, index }) => header === 'id' ? header : null,
        mapValues: ({ header, index, value }) => {
          if(header === 'id') return parseInt(value);
          else return 0;
        }
      }))
      .on('data', (row) => {
        extractedData.push(row);
      })
      .on('end', () => {
        console.log(`+++ READ_ROOMS: room_id(s) extracted ${extractedData.length} lines`);
        resolve(extractedData);
      });
  })
};

// reads guest.csv and extracts guest_id
const readFromGuestCSV = (filename) => {
  return new Promise((resolve, reject) => {
    const extractedData = [];
    fs.createReadStream(filename)
      .pipe(csvReader({
        mapHeaders: ({ header, index }) => header === 'id' ? header : null,
        mapValues: ({ header, index, value }) => {
          if(header === 'id') return parseInt(value);
          else return 0;
        }
      }))
      .on('data', (row) => {
        extractedData.push(row);
      })
      .on('end', () => {
        console.log(`+++ READ_GUESTS: guest_id(s) extracted ${extractedData.length} lines`);
        resolve(extractedData);
      });
  })
}

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
              id: id,
              hotel_id: arr[i].id
            }
            data.beds = randomNumber(1,15);
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
              id: id,
              hotel_id: arr[i].id
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

// write roomRates to .csv
const writeToRatesCSV = (writer, arr, fileNum) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/roomRate${fileNum}.csv`));
    function write () {
      let ok = true;
      do{
        let data = createRoomRate(arr[i]);
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

// write bookings to .csv
const writeToBookingCSV = (writer, roomsArr, guestsArr) => {
  return new Promise((resolve, reject) => {
    let i = 0;
    writer.pipe(fs.createWriteStream(`${OUTPUT_PATH}/booking.csv`));
    function write () {
      let ok = true;
      do{
        let data = createBooking(roomsArr, guestsArr)
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

  // create guests
  const writeGuests = csvWriter({ headers: ['id', 'first_name', 'last_name', 'email', 'phone'] });
  const guests = await writeToGuestsCSV(writeGuests, config);

  // create hotels
  const writeHotels = csvWriter({ headers: ['id', 'title', 'zip_code', 'address', 'url', 'rating', 'reviews_total', 'rooms_total'] });
  const hotels = await writeToHotelCSV(writeHotels, config);

  // extract data from hotels
  const dataFromHotelCSV = await readFromHotelCSV(`${OUTPUT_PATH}/hotel.csv`);
  console.log('+++ hotel_id(s) extracted:', dataFromHotelCSV.length);

  // create rooms
  const writeRooms = csvWriter({ headers: ['id', 'beds', 'hotel_id'] });
  const rooms = await writeToRoomsCSV(writeRooms, dataFromHotelCSV);

  // extract room_id from rooms
  const dataFromRoomCSV = await readFromRoomCSV(`${OUTPUT_PATH}/room.csv`);

  // extract guest_id from guests
  const dataFromGuestCSV = await readFromGuestCSV(`${OUTPUT_PATH}/guest.csv`);

  // create bookings
  const writeBookings = csvWriter({ headers: ['id', 'guest_id', 'room_id', 'check_in', 'check_out'] });
  const bookings = await writeToBookingCSV(writeBookings, dataFromRoomCSV, dataFromGuestCSV);

  // create roomRates, write to several files
  const leng = dataFromRoomCSV.length;
  const chunkSize = Math.floor(leng / config.NUMBER_OF_RATE_FILES);
  let currentNum = 1;

  for (let i = 0; i < leng; i += chunkSize) {
    let writeRoomRates = csvWriter({ headers: ['id', 'service_id', 'service_title', 'price', 'day_Date', 'room_id']})
    let chunk = dataFromRoomCSV.slice(i, i + chunkSize)
    let roomRates = await writeToRatesCSV(writeRoomRates, chunk, currentNum);
    currentNum++;
  }

  console.log('\n','TOTAL DATA GENERATED:', counters, '\n')
};

driver();