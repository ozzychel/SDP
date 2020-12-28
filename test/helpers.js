const moment = require('moment');

const checkIn_DaysFromToday = 0; // keep 0 for today
const checkOut_DaysFromCheckIn = 1;
const maxNumber = 10000000;

const getRandomIdAndDates = (userContext, events, done) => {
  let randomNum = Math.floor(1 + Math.random() * (maxNumber - 1));
  let randomCheckIn = moment().add(checkIn_DaysFromToday, 'days').format('YYYY-MM-DD');
  let randomCheckOut = moment(randomCheckIn).add(checkOut_DaysFromCheckIn, 'day').format('YYYY-MM-DD');
  userContext.vars.id = randomNum;
  userContext.vars.check_in = randomCheckIn;
  userContext.vars.check_out = randomCheckOut;
  return done();
};

module.exports = {
  getRandomIdAndDates
}
