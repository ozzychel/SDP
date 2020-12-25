import axios from 'axios';

const getDataFromServer = async ({ hotelId, check_in, check_out }) => {
  try {
    const response = await axios.get(`/api/calendar/hotels/${hotelId}`, {
      params: { check_in, check_out }
    });
    return response.data;
  } catch (err) {
    console.log('Error: in getDataFromServer', err);
  }
};

export default getDataFromServer;