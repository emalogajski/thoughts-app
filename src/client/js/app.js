const dotenv = require('dotenv');

dotenv.config();
const axios = require('axios');

const basePath = 'http://localhost:3000';


const displayThoughts = () => {
  const thoughts = [];
  fetchThoughts();
  thoughts.forEach()
}

const fetchThoughts = async () => {
  try {
    const response = await axios.get(`${basePath}/thoughts`);
    // thoughts.push(response);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  fetchThoughts,
}