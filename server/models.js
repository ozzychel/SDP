const db = require('../database/postgresDB/index');

const getHotel = async ({ hotelId }, { check_in }, callback) => {
  let query = `SELECT * FROM hotel JOIN room ON hotel.id=room.hotel_id JOIN room_rate ON room.id=room_rate.room_id WHERE hotel.id = ${hotelId} AND room_rate.day_date = '${check_in}' ORDER BY room.id ASC, price ASC`;
  try{
    let queryResult = await db.pool.query(query);
    let processed = await calcualteLowestPrice(queryResult.rows);
    callback(null, processed);
  } catch (err) {
    console.log('Error: in Model.getHotel', err);
    callback(err, null);
  }
};

const getHotelUpdated = async (hotelId, conf, callback) => {
  let query = `SELECT * FROM hotel JOIN room ON hotel.id=room.hotel_id JOIN room_rate ON room.id=room_rate.room_id WHERE hotel.id = ${hotelId} AND room_rate.day_date = '${conf.check_in}' ORDER BY room.id ASC, price ASC`;
  try{
    let queryResult = await db.pool.query(query);
    let processed = await calcualteLowestPrice(queryResult.rows);
    let updated = await calculateWithUserConf(processed, conf);
    callback(null, processed);
  } catch (err) {
    console.log('Error: in Model.getHotel', err);
    callback(err, null);
  }
};

const bookHotelRoom = async (hotelId, { guest_id, room_id, check_in, check_out }, callback) => {
  let query = `INSERT INTO booking (guest_id, room_id, check_in, check_out) VALUES (${guest_id}, ${room_id}, '${check_in}', '${check_out}')`;
  try{
    let result = await db.pool.query(query);
    callback(null, result);
  } catch (err) {
    console.log('Error: in Model.bookHotelRoom', err);
    callback(err, null);
  }
};

const deleteBooking = async (hotelId, { rate_id, guest_id, room_id }, callback) => {
  let query = `DELETE FROM booking WHERE id = ${rate_id} AND guest_id = ${guest_id} AND room_id = ${room_id};`;
  console.log(query)
  try{
    let result = await db.pool.query(query);
    callback(null, result);
  } catch (err) {
    console.log('Error: in Model.deleteBooking', err);
    callback(err, null);
  }
}

function calculateWithUserConf (processed, conf) {
  // it should compare user config with certain room, total beds and caacity
  // for the sake of simplicity in this project just minor adjustment
  processed[0].prices.map((elem) => {
    if(conf.roomsNumber - 1) elem.price *= conf.roomsNumber;
    if(conf.guestsNumber > 4) elem.price *= 2;
    return elem;
  })
  return processed;
}

function calcualteLowestPrice (arr) {
  let hotel = arr[0];
  const result = {
    hotel_id: hotel.hotel_id,
    rooms_total: hotel.rooms_total,
    title: hotel.title,
    zip_code: hotel.zip_code,
    address: hotel.address,
    url: hotel.url,
    rating: hotel.rating,
    reviews_total: hotel.reviews_total,
    prices: []
  };
  let hash = {};
  for(let i = 0; i < arr.length; i++) {
    let elem = arr[i];
    !hash[elem.service_title] ? hash[elem.service_title] = +Infinity : null;
  }
  for(let i = 0; i < arr.length; i++) {
    let elem = arr[i];
    if(elem.price < hash[elem.service_title] && elem.price !== 0) {
      hash[elem.service_title] = elem.price;
    }
  }
  for(let i = 0; i < arr.length; i++) {
    let elem = arr[i];
    if(hash[elem.service_title] === elem.price) {
      let bestRate = {
        rate_id: elem.id,
        service_id: elem.service_id,
        service_title: elem.service_title,
        room_id: elem.room_id,
        price: elem.price,
        day_date: elem.day_date
      }
      result.prices.push(bestRate);
    }
  }
  return [result];
}

module.exports = {
  getHotel,
  getHotelUpdated,
  bookHotelRoom,
  deleteBooking
};