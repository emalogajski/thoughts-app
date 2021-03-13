const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const basePath = 'http://localhost:3000';

let newCell;
let tableBody;
let td;
let textArea;

const init = () => {
  
  const fetchThoughts = async () => {
    tableBody = document.getElementById('table-body');
    textArea = document.getElementById('textarea');
    try {
      const response = await axios.get(`${basePath}/thoughts`);
      tableBody.innerHTML = '';
      response.data.forEach(item => {
        const row = addNewRow();
        addNewCell(row, item);
      })
    } catch (err) {
      console.error(err);
    }
  };
  fetchThoughts();
  textArea.addEventListener('keyup', countCharacters);
}

window.onload = init;

const createActionCell = (element) => {
  td = document.createElement('td');

  //create span that holds Trash symbol and attach to cell
  const spanTrash = document.createElement('span');
  const iTrash = document.createElement('i');
  spanTrash.appendChild(iTrash);
  spanTrash.classList.add('icon-button', 'danger');
  iTrash.classList.add('fas', 'fa-trash');
  td.appendChild(spanTrash);

  //create span that holds Edit symbol and attach to cell
  const spanEdit = document.createElement('span');
  spanEdit.classList.add('icon-button', 'info');
  const iEdit = document.createElement('i');
  iEdit.classList.add('fas', 'fa-edit');
  spanEdit.appendChild(iEdit);
  td.appendChild(spanEdit);
  element.append(td);
}

const addNewRow = () => {
  const row = document.createElement('tr');
  tableBody.append(row);
  return row;
}

const addNewCell = (newThoughtRow,item) => {
  const arrayOfNeededItems = Object.keys(item).filter(key => key === 'thought' || key === 'timestamp').sort().reverse();
  const timestampValueNumber = parseInt(item['timestamp']);
  const newDate = new Date(timestampValueNumber);
  const dateFormat = `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
  item['timestamp'] = dateFormat;
  if(arrayOfNeededItems.length === 2) {
    arrayOfNeededItems.forEach(element => {
      newCell = document.createElement('td');
      newCell.innerHTML = `${item[element]}`;
      newThoughtRow.append(newCell);
    })
  } else if(arrayOfNeededItems[0] !== 'timestamp') {
    arrayOfNeededItems.splice(0, 0, 'placeholder')
    arrayOfNeededItems.forEach(element => {
      if(item[element]) {
        newCell = document.createElement('td');
        newCell.innerHTML = `${item[element]}`;
        newThoughtRow.append(newCell);
      } else {
        newCell = document.createElement('td');
        newCell.innerHTML = dateFormat;
        newThoughtRow.append(newCell);
      }
    })
  } else if (arrayOfNeededItems[0] === 'timestamp') {
    arrayOfNeededItems.splice(1, 0, 'placeholder')
    arrayOfNeededItems.forEach(element => {
      if(item[element]) {
        newCell = document.createElement('td');
        newCell.innerHTML = `${item[element]}`;
        newThoughtRow.append(newCell);
      } else {
        newCell = document.createElement('td');
        newCell.innerHTML = '';
        newThoughtRow.append(newCell);
      }
    })
  }
  createActionCell(newThoughtRow);
}

const countCharacters = () => {
  const characterCounter = document.getElementById('current');
  const liveCharacterCount = textArea.value.length;
  characterCounter.innerHTML = `${liveCharacterCount}`;
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