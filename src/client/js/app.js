const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const basePath = 'http://localhost:3000';

let newThoughtRow;
let newCell;
let TableBody;
let currentRows;
let td;

const init = () => {
  
  const fetchThoughts = async () => {
    newThoughtRow = document.createElement('tr');
    try {
      const response = await axios.get(`${basePath}/thoughts`);
      emptyTable();
      response.data.forEach(item => {
        addNewRow(),
        addNewCell(item);
      })
    } catch (err) {
      console.error(err);
    }
  };
  fetchThoughts();
}

window.onload = init;

const emptyTable = () => {
  currentRows = document.getElementsByClassName('thought-row');
  for(let i = 0; i < currentRows.length; i++) {
    currentRows[i].innerHTML = '';
  }
}

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
  TableBody = document.getElementById('table-body');
  TableBody.append(newThoughtRow);
}

const addNewCell = (item) => {
  const arrayOfNeededItems = Object.keys(item).filter(key => key === 'thought' || key === 'timestamp').sort().reverse();
  const dateFormat = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
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
        newCell.innerHTML = `${dateFormat}`;
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

// const displayThoughts = () => {
//   thoughtTextareaInput = document.getElementsByTagName('textarea').value;
//   submitButton = document.getElementById('submitInput');
//   submitButton.addEventListener('onclick', () => {
//     if(thoughtTextareaInput.length !== 0) {
//       removeCurrentThoughtRows();

//     }
//   })
// }