import axios from 'axios';

const getUpdatedDataFromServer = async (data, cb) => {
  try {
    const response = await axios.get('/api/calendar/update/', {
      params: data
    });
    cb(response.data);
  } catch (err) {
    console.log('Error: in getUpdatedDataFromServer:', err);
  }
};

export default getUpdatedDataFromServer;