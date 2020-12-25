DROP DATABASE IF EXISTS calendar;
CREATE DATABASE calendar;

\connect calendar;

DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS room_rate;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS hotel;
DROP TABLE IF EXISTS guest;

CREATE TABLE hotel (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
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
  hotel_id INTEGER REFERENCES hotel(id)
);

CREATE TABLE booking (
  id SERIAL NOT NULL,
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
COPY hotel(id,title,zip_code,address,url,rating,reviews_total,rooms_total)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/hotel.csv' DELIMITER ',' CSV HEADER;

-- import guest
COPY guest(id,first_name,last_name,email,phone)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/guest.csv' DELIMITER ',' CSV HEADER;

-- import room
COPY room(id,hotel_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/room.csv' DELIMITER ',' CSV HEADER;

-- import booking
COPY booking(id,guest_id,room_id,check_in,check_out)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/booking.csv' DELIMITER ',' CSV HEADER;

-- import room_rate
COPY room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate1.csv' DELIMITER ',' CSV HEADER;

COPY room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate2.csv' DELIMITER ',' CSV HEADER;

COPY room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate3.csv' DELIMITER ',' CSV HEADER;

COPY room_rate(id,service_id,service_title,price,day_Date,room_id)
FROM '/Users/ozzy_chel/Projects/SDP/data/postgresData/roomRate4.csv' DELIMITER ',' CSV HEADER;

-- create indexes

-- CREATE INDEX CONCURRENTLY hotel_id_idx ON hotel (id);
-- CREATE INDEX CONCURRENTLY userid_idx ON users (user_id);