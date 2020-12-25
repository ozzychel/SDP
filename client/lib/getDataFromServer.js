import axios from 'axios';

const getDataFromServer = async (term) => {
  try {
    const response = await axios.get(`/api/calendar/hotels/${term}`);
    // console.log('==APP LOG: getDataFromServer response:', response.data.rows)
    return response.data;
  } catch (err) {
    console.log('Error: in getDataFromServer', err);
    return [];
  }
};

export default getDataFromServer;