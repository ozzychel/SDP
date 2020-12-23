const faker = require('faker');
const fs = require('fs');
const csvWriter = require('csv-write-stream');

const createHotel = () => {
  const generatedData = [];
  let hotel = {
    title: faker.lorem.sentence()
  }
};