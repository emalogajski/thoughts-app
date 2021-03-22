const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const basePath = 'http://localhost:3000';
const clearButton = document.getElementById('clearInput');
const submitButton = document.getElementById('submitInput');
const characterCounter = document.getElementById('current');
const textArea = document.getElementById('textarea');
const tableBody = document.getElementById('table-body');


let newCell;
let td;

const init = () => {
  
  const fetchThoughts = async () => {
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

  const saveThought = async (thought) => {
    try {
      await axios.post(`${basePath}/thoughts`, {thought});
      clearText();
      const amountOfCharacters = countCharacters();
      updateCharacterCount(amountOfCharacters);
      enableDisableButtons(amountOfCharacters);
    } catch (err) {
      console.error(err);
    }
  }

  fetchThoughts();
  textArea.addEventListener('keyup', () => {
    const amountOfCharacters = countCharacters();
    updateCharacterCount(amountOfCharacters);
    enableDisableButtons(amountOfCharacters);
  });

  clearButton.addEventListener('click', () => {
    clearText();
    const amountOfCharacters = countCharacters();
    updateCharacterCount(amountOfCharacters);
    enableDisableButtons(amountOfCharacters);
  });

  submitButton.addEventListener('click', () => saveThought(textArea.value));

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
  return textArea.value.length;
}

const updateCharacterCount = (amountOfCharacters) => {
  characterCounter.innerHTML = amountOfCharacters;
}

const enableDisableButtons = (amountOfCharacters) => {
  const charactersPresent = amountOfCharacters > 0;
  clearButton.disabled = !charactersPresent;
  submitButton.disabled = !charactersPresent;
}

const clearText = () => {
  textArea.value = '';
  textArea.value.length = 0;
}


