DROP DATABASE IF EXISTS calendar;
CREATE DATABASE calendar;

\connect calendar;

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

CREATE TABLE room (
  id SERIAL PRIMARY KEY,
  hotel_id REFERENCES hotel(id)
);

CREATE TABLE room_rate (
  id SERIAL PRIMARY KEY,
  service_id SMALLINT NOT NULL,
  service_title VARCHAR(30) NOT NULL,
  price INTEGER NOT NULL,
  day_Date DATETIME NOT NULL,
  room_id REFERENCES room(id)
);

CREATE TABLE guest (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL
);

CREATE TABLE booking (
  id SERIAL NOT NULL,
  guest_id REFERENCES guest(id),
  room_id REFERENCES room(id),
  check_in DATETIME NOT NULL,
  chek_out DATETIME NOT NULL
);


-- import hotel
-- import room
-- import room_rate
-- import guest
-- import booking

-- create indexes
