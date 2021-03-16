const axios = require('axios');
const dotenv = require('dotenv');
const basePath = 'http://localhost:3000';
const myAxios =  axios.create({
  baseURL: basePath
});

dotenv.config();

const tableBody = document.getElementById('thoughts-table-body');


const createTableRowString = (dateString, thought) => `
  <tr>
  <td>${dateString}</td>
  <td>${thought}</td>
  <td>
      <span class="icon-button danger">
          <i class="fas fa-trash"></i>
      </span>
      <span class="icon-button info">
          <i class="fas fa-edit"></i>
      </span>
  </td>
  </tr>
  `;

const getThoughtData = async () => {
  try {
    const thoughts = await myAxios.get('/thoughts');
    return thoughts.data;
  } catch (e) {
    console.error('Something went wrong');
    return [];
  }
}

const formatDate = timestamp => {
  const date = new Date(timestamp);
  return `${date.getDay()}.${date.getMonth()+1}.${date.getFullYear()}`;
}

const getAndDisplayThoughts = async () => {
  tableBody.innerHTML = "";
  const thoughts = await getThoughtData();
  const thoughtsHtml = thoughts.map(({timestamp, thought}) => createTableRowString(formatDate(timestamp),thought)).join('');
  tableBody.innerHTML = thoughtsHtml;

}

getAndDisplayThoughts();









