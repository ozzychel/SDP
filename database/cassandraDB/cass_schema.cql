DROP KEYSPACE IF EXISTS calendar;
CREATE KEYSPACE calendar WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE calendar;

DROP TABLE IF EXISTS hotel_by_id_and_title;
CREATE TABLE hotel_by_id_and_title (
  hotel_id int,
  title text,
  zip_code text,
  address text,
  url text,
  rating float,
  reviews_total int,
  rooms_total int,
  PRIMARY KEY ((hotel_id, title), zip_code)
) WITH CLUSTERING ORDER BY (zip_code ASC);

DROP TABLE IF EXISTS hotel_by_id_and_zip;
CREATE TABLE hotel_by_id_and_zip (
  hotel_id int,
  title text,
  zip_code text,
  address text,
  url text,
  rating float,
  reviews_total int,
  rooms_total int,
  PRIMARY KEY ((hotel_id, zip_code), title)
) WITH CLUSTERING ORDER BY (title ASC);

DROP TABLE IF EXISTS guest_by_guestid;
CREATE TABLE guest_by_guestid (
  guest_id int,
  first_name text,
  last_name text,
  email text,
  phone text
  PRIMARY KEY (guest_id)
) WITH CLUSTERING ORDER BY (guest_id ASC);

DROP TABLE IF EXISTS guest_by_guestid_and_email;
CREATE TABLE guest_by_guestid_and_email (
  guest_id int,
  first_name text,
  last_name text,
  email text,
  phone text
  PRIMARY KEY ((guest_id, email), last_name)
) WITH CLUSTERING ORDER BY (last_name ASC);

DROP TABLE IF EXISTS guest_by_guestid_and_lastname;
CREATE TABLE guest_by_guestid_and_lastname (
  guest_id int,
  first_name text,
  last_name text,
  email text,
  phone text
  PRIMARY KEY ((guest_id, last_name), email)
) WITH CLUSTERING ORDER BY (email ASC);

DROP TABLE IF EXISTS room_rate_by_date_and_price;
CREATE TABLE room_rate_by_date_and_price (
  hotel_id int,
  title text,
  zip_code text,
  address text,
  url text,
  rating float,
  reviews_total int,
  rooms_total int,
  room_id int,
  rate_id int,
  service_id smallint,
  service_title text,
  price int,
  day_Date date
  PRIMARY KEY ((day_Date, price), hotel_id)
) WITH CLUSTERING ORDER BY (hotel_id ASC);

DROP TABLE IF EXISTS room_rate_by_hotelid_and_date;
CREATE TABLE room_rate_by_hotelid_and_date (
  hotel_id int,
  title text,
  zip_code text,
  address text,
  url text,
  rating float,
  reviews_total int,
  rooms_total int,
  room_id int,
  rate_id int,
  service_id smallint,
  service_title text,
  price int,
  day_Date date
  PRIMARY KEY ((hotel_id, date), price)
) WITH CLUSTERING ORDER BY (price ASC);

DROP TABLE IF EXISTS booking_by_guestid_and_roomid;
CREATE TABLE booking_by_guestid_and_roomid (
  guest_id int,
  guest_firstname text,
  guest_lastname text,
  guest_email text,
  guest_phone text,
  guest_qty smallint,
  check_in date,
  check_out date,
  hotel_id int,
  hotel_title text,
  hotel_url text,
  hotel_address text,
  hotel_zipcode text,
  room_id int,
  room_beds smallint,
  PRIMARY KEY ((guest_id, room_id), check_in)
) WITH CLUSTERING ORDER BY (check_in ASC);

DROP TABLE IF EXISTS booking_by_guestid_and_checkin;
CREATE TABLE booking_by_guestid_and_roomid (
  guest_id int,
  guest_firstname text,
  guest_lastname text,
  guest_email text,
  guest_phone text,
  guest_qty smallint,
  check_in date,
  check_out date,
  hotel_id int,
  hotel_title text,
  hotel_url text,
  hotel_address text,
  hotel_zipcode text,
  room_id int,
  room_beds smallint,
  PRIMARY KEY ((guest_id, check_in), hotel_id)
) WITH CLUSTERING ORDER BY (hotel_id ASC);

DROP TABLE IF EXISTS booking_by_guestid_and_hotelid;
CREATE TABLE booking_by_guestid_and_hotelid (
  guest_id int,
  guest_firstname text,
  guest_lastname text,
  guest_email text,
  guest_phone text,
  guest_qty smallint,
  check_in date,
  check_out date,
  hotel_id int,
  hotel_title text,
  hotel_url text,
  hotel_address text,
  hotel_zipcode text,
  room_id int,
  room_beds smallint,
  PRIMARY KEY ((guest_id, hotel_id), check_in)
) WITH CLUSTERING ORDER BY (check_in ASC);

/* import hotels */
COPY hotel_by_id_and_title(hotel_id,title,zip_code,address,url,rating,reviews_total,rooms_total)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/hotel.csv'
with header=true and delimiter =',';

COPY hotel_by_id_and_zip(hotel_id,title,zip_code,address,url,rating,reviews_total,rooms_total)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/hotel.csv'
with header=true and delimiter =',';

/* import guests */
COPY guest_by_guestid(guest_id int,first_name,last_name,email,phone)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/guest.csv'
with header=true and delimiter =',';

COPY guest_by_guestid_and_email(guest_id int,first_name,last_name,email,phone)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/guest.csv'
with header=true and delimiter =',';

COPY guest_by_guestid_and_lastname(guest_id int,first_name,last_name,email,phone)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/guest.csv'
with header=true and delimiter =',';

/* import room_rates(by date and price) */
COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate1.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate2.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate3.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate4.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate5.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate6.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate7.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate8.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate9.csv'
with header=true and delimiter =',';

COPY room_rate_by_date_and_price(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate10.csv'
with header=true and delimiter =',';

/* import room_rates(by hotel_id and date) */
COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate1.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate2.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate3.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate4.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate5.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate6.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate7.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate8.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate9.csv'
with header=true and delimiter =',';

COPY room_rate_by_hotelid_and_date(hotel_id int,title,zip_code,address,url,rating,reviews_total,rooms_total,room_id,rate_id,service_id,service_title,price,day_Date)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/roomRate10.csv'
with header=true and delimiter =',';

/* import bookings */
COPY booking_by_guestid_and_roomid(guest_id,guest_firstname,guest_lastname,guest_email,guest_phone,guest_qty,check_in,check_out,hotel_id,hotel_title,hotel_url,hotel_address,hotel_zipcode,room_id,room_beds)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/booking.csv'
with header=true and delimiter =',';

COPY booking_by_guestid_and_checkin(guest_id,guest_firstname,guest_lastname,guest_email,guest_phone,guest_qty,check_in,check_out,hotel_id,hotel_title,hotel_url,hotel_address,hotel_zipcode,room_id,room_beds)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/booking.csv'
with header=true and delimiter =',';

COPY booking_by_guestid_and_hotelid(guest_id,guest_firstname,guest_lastname,guest_email,guest_phone,guest_qty,check_in,check_out,hotel_id,hotel_title,hotel_url,hotel_address,hotel_zipcode,room_id,room_beds)
FROM '/Users/ozzy_chel/Projects/SDP/data/cassandraData/booking.csv'
with header=true and delimiter =',';