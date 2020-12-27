import axios from 'axios';

const getUpdatedDataFromServer = async ({hotelId, check_in, check_out, adultsNumber, childrenNumber, guestsNumber, roomsNumber}, cb) => {
  try {
    const response = await axios.get(`/api/calendar/hotel/${hotelId}/update`, {
      params: { check_in, check_out, adultsNumber, childrenNumber, guestsNumber, roomsNumber }
    });
    cb(response.data);
  } catch (err) {
    console.log('Error: in getUpdatedDataFromServer:', err);
  }
};

export default getUpdatedDataFromServer;