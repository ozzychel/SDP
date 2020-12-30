DROP DATABASE IF EXISTS calendar;
CREATE DATABASE calendar;

\connect calendar;

CREATE TABLE hotel (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  zip_code VARCHAR(15) NOT NULL,
  address TEXT NOT NULL,
  url TEXT NOT NULL,
  rating REAL NOT NULL,
  reviews_total INTEGER NOT NULL,
  rooms_total INTEGER NOT NULL
);

CREATE TABLE guest (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL
);

CREATE TABLE room (
  id SERIAL PRIMARY KEY,
  beds SMALLINT NOT NULL,
  hotel_id INTEGER REFERENCES hotel(id)
);

CREATE TABLE booking (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guest(id),
  room_id INTEGER REFERENCES room(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL
);

CREATE TABLE room_rate (
  id SERIAL PRIMARY KEY,
  service_id SMALLINT NOT NULL,
  service_title VARCHAR(30) NOT NULL,
  price INTEGER NOT NULL,
  day_Date DATE NOT NULL,
  room_id INTEGER REFERENCES room(id)
);

-- import hotel
CREATE TABLE temp_hotel(id INTEGER PRIMARY KEY, title TEXT NOT NULL, zip_code VARCHAR(15) NOT NULL,
  address TEXT NOT NULL, url TEXT NOT NULL, rating REAL NOT NULL, reviews_total INTEGER NOT NULL,rooms_total INTEGER NOT NULL
);

COPY temp_hotel(id,title,zip_code,address,url,rating,reviews_total,rooms_total)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/hotel0.csv' DELIMITER ',' CSV HEADER;

COPY temp_hotel(id,title,zip_code,address,url,rating,reviews_total,rooms_total)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/hotel1.csv' DELIMITER ',' CSV HEADER;

COPY temp_hotel(id,title,zip_code,address,url,rating,reviews_total,rooms_total)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/hotel2.csv' DELIMITER ',' CSV HEADER;

COPY temp_hotel(id,title,zip_code,address,url,rating,reviews_total,rooms_total)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/hotel3.csv' DELIMITER ',' CSV HEADER;

COPY temp_hotel(id,title,zip_code,address,url,rating,reviews_total,rooms_total)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/hotel4.csv' DELIMITER ',' CSV HEADER;

INSERT INTO hotel (title,zip_code,address,url,rating,reviews_total,rooms_total)
SELECT title,zip_code,address,url,rating,reviews_total,rooms_total
FROM temp_hotel;
DROP TABLE temp_hotel;

-- import guest
CREATE TABLE temp_guest (id INTEGER PRIMARY KEY, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, phone VARCHAR(20) NOT NULL);
COPY temp_guest(id, first_name,last_name,email,phone)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/guest.csv' DELIMITER ',' CSV HEADER;
INSERT INTO guest(first_name,last_name,email,phone)
SELECT first_name,last_name,email,phone
FROM temp_guest;
DROP TABLE temp_guest;

-- import room
CREATE TABLE temp_room (id INTEGER PRIMARY KEY, beds SMALLINT NOT NULL, hotel_id INTEGER REFERENCES hotel(id));
COPY temp_room(id,beds,hotel_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/room.csv' DELIMITER ',' CSV HEADER;
INSERT INTO room(beds,hotel_id)
SELECT beds,hotel_id
FROM temp_room;
DROP TABLE temp_room;

-- import booking
CREATE TABLE temp_booking (id INTEGER NOT NULL,guest_id INTEGER REFERENCES guest(id),room_id INTEGER REFERENCES room(id),check_in DATE NOT NULL,check_out DATE NOT NULL);
COPY temp_booking(id,guest_id,room_id,check_in,check_out)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/booking.csv' DELIMITER ',' CSV HEADER;
INSERT INTO booking(guest_id,room_id,check_in,check_out)
SELECT guest_id,room_id,check_in,check_out
FROM temp_booking;
DROP TABLE temp_booking;

-- import room_rate
CREATE TABLE temp_room_rate (id INTEGER PRIMARY KEY,service_id SMALLINT NOT NULL,service_title VARCHAR(30) NOT NULL,price INTEGER NOT NULL,day_Date DATE NOT NULL,room_id INTEGER REFERENCES room(id));

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate0.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate1.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate2.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate3.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate4.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate5.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate6.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate7.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate8.csv' DELIMITER ',' CSV HEADER;

COPY temp_room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate9.csv' DELIMITER ',' CSV HEADER;

INSERT INTO room_rate(service_id,service_title,price,day_Date,room_id)
SELECT service_id,service_title,price,day_Date,room_id
FROM temp_room_rate;
DROP TABLE temp_room_rate;

-- create indexes

CREATE INDEX CONCURRENTLY room_hotelid_idx ON room (hotel_id);
CREATE INDEX CONCURRENTLY booking_guestid_idx ON booking (guest_id);
CREATE INDEX CONCURRENTLY booking_roomid_idx ON booking (room_id);
CREATE INDEX CONCURRENTLY room_rate_roomid_idx ON room_rate (room_id);
CREATE INDEX CONCURRENTLY room_rate_day_idx ON room_rate (day_Date);
