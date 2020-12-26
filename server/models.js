const db = require('../database/postgresDB/index');

const getHotel = async (query, callback) => {
  try{
    let queryResult = await db.pool.query(query);
    let processed = await calcualteLowestPrice(queryResult.rows);
    callback(null, processed);
  } catch (err) {
    console.log('Error: in Model.getHotel', err);
    callback(err, null);
  }
};

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
  getHotel
};