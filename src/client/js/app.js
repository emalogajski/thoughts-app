const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const basePath = 'http://localhost:3000';

let newThoughtRow;
let newCell;
let bodyOfTable;
let newTableBody;


const init = () => {
  
  const fetchThoughts = async () => {
    newThoughtRow = document.createElement('tr');
    try {
      const response = await axios.get(`${basePath}/thoughts`);
      console.log(response.data);
      removeCurrentThoughtBody();
      response.data.forEach(item => {
        addNewRow(),
        addNewCell(item);
      })
      // console.log(newTableBody); works!!
    } catch (err) {
      console.error(err);
    }
  };
  fetchThoughts();
}

window.onload = init;

const removeCurrentThoughtBody = () => {
  bodyOfTable = document.getElementById('table-body');
  newTableBody = document.createElement('tbody');
  bodyOfTable.parentNode.replaceChild(newTableBody, bodyOfTable);
}

const addNewRow = () => {
  newThoughtRow.classList.add('thought-row');
  newTableBody.append(newThoughtRow);
  // console.log(newTableBody); works!!
}

const addNewCell = (item) => {
  Object.keys(item).sort().reverse().forEach(key => {
    if(key !== 'id') {
      newCell = document.createElement('td');
      newCell.innerHTML = `${item[key]}`;
      newThoughtRow.append(newCell);
    } else {
      return;
    }
  })
}


// const displayThoughts = () => {
//   thoughtTextareaInput = document.getElementsByTagName('textarea').value;
//   submitButton = document.getElementById('submitInput');
//   submitButton.addEventListener('onclick', () => {
//     if(thoughtTextareaInput.length !== 0) {
//       removeCurrentThoughtRows();

//     }
//   })
// }