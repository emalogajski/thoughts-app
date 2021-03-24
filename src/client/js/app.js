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
let textArea;
const thoughtObjects = [];

const fetchThoughts = async () => {

  try {
    const response = await axios.get(`${basePath}/thoughts`);
    
    thoughtObjects.length = 0;
    thoughtObjects.push(...response.data)
    renderTable()
  } catch (err) {
    console.error(err);
  }
};
const init = () => {
  textArea = document.getElementById("textarea");
  tableBody = document.getElementById("table-body");
  fetchThoughts();
  document.getElementById("submitInput").addEventListener("click", onSubmit);
  document.getElementById("clearInput").addEventListener("click", onClear);

  textArea.addEventListener('keyup', countCharacters);
  
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

}

window.onload = init;

const renderTable = () => {
  emptyTable();
  thoughtObjects.forEach(item => {
    const row = addNewRow();
    addNewCell(row,item);
  });
}

const onClear = () => {
  textArea.value = "";
}

const onSubmit = async () => {
  const thought = textArea.value;

  const {data: newThought} = await axios.post(`${basePath}/thoughts`, {thought});
  onClear();
  thoughtObjects.unshift(newThought)
  renderTable();
}

const emptyTable = () => {
  tableBody.innerHTML = "";
}

const createActionCell = (row) => {
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
  row.append(td);
}

const addNewRow = () => {
  const row = document.createElement('tr');
  tableBody.append(row);
  return row;
}

const addNewCell = (newThoughtRow,item) => {
  const newDate = new Date(item.timestamp)
  const dateFormat = `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;

  // create date cell
  const newDateCell = document.createElement('td');
  newDateCell.innerHTML = dateFormat;
  newThoughtRow.append(newDateCell);

  // create thought cell
  const newThoughtCell = document.createElement('td');
  newThoughtCell.innerHTML = item.thought;
  newThoughtRow.append(newThoughtCell);

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


