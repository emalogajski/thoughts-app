const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const basePath = 'http://localhost:3000';
const clearButton = document.getElementById('clearInput');
const submitButton = document.getElementById('submitInput');
const characterCounter = document.getElementById('current');
const textArea = document.getElementById('textarea');
const tableBody = document.getElementById('table-body');
const sortDateButton = document.getElementById('sort-date-button');
const sortThoughtsButton = document.getElementById('sort-thoughts-button');
let sortingDateImage;
let sortingThoughtsImage;

let td;
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

const init = () => {
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
  document.getElementById('submitInput').addEventListener('click', onSubmit);
  sortDateButton.addEventListener('click', () => {
    sortingDateImage = document.getElementById('sorting-image-for-date');
    sortDateButton.classList.add('active');
    sortThoughtsButton.classList.remove('active');
    if(sortingDateImage.classList.contains('fa-sort')) {
      sortingDateImage.classList.remove('fa-sort');
      sortingDateImage.classList.add('fa-sort-up');
      sortByDateDescending();
    } else if(sortingDateImage.classList.contains('fa-sort-up')) {
      sortingDateImage.classList.remove('fa-sort-up');
      sortingDateImage.classList.add('fa-sort-down');
      sortByDateAscending();
    } else if (sortingDateImage.classList.contains('fa-sort-down')){
      sortingDateImage.classList.remove('fa-sort-down');
      sortingDateImage.classList.add('fa-sort-up');
      sortByDateDescending();
    }
  });
  sortThoughtsButton.addEventListener('click', () => {
    sortThoughtsButton.classList.add('active');
    sortDateButton.classList.remove('active');
    sortingThoughtsImage = document.getElementById('sorting-image-for-thoughts');
    if(sortingThoughtsImage.classList.contains('fa-sort')) {
      sortingThoughtsImage.classList.remove('fa-sort');
      sortingThoughtsImage.classList.add('fa-sort-up');
      sortByThoughtsDescending();
    } else if(sortingThoughtsImage.classList.contains('fa-sort-up')) {
      sortingThoughtsImage.classList.remove('fa-sort-up');
      sortingThoughtsImage.classList.add('fa-sort-down');
      sortByThoughtsAscending();
    } else {
      sortingThoughtsImage.classList.remove('fa-sort-down');
      sortingThoughtsImage.classList.add('fa-sort-up');
      sortByThoughtsAscending();
    }
  });
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

const sortByDateAscending = () => {
  const sortedArray = thoughtObjects.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });
  emptyTable();
  sortedArray.forEach(item => {
    const row = addNewRow();
    addNewCell(row,item);
  });
}

const sortByDateDescending = () => {
  const sortedArray = thoughtObjects.sort(function (a, b) {
    return b.timestamp - a.timestamp;
  });
  emptyTable();
  sortedArray.forEach(item => {
    const row = addNewRow();
    addNewCell(row,item);
  });
}

const sortByThoughtsAscending = () => {
  const sortedArray = thoughtObjects.sort(function(a, b) {
    let thoughtA = a.thought.toUpperCase();
    let thoughtB = b.thought.toUpperCase();
    if(thoughtA < thoughtB) {
      return -1;
    } else if(thoughtA > thoughtB) {
      return 1;
    }
    return 0;
  });
  emptyTable();
  sortedArray.forEach(item => {
    const row = addNewRow();
    addNewCell(row,item);
  });
}

const sortByThoughtsDescending = () => {
  const sortedArray = thoughtObjects.sort(function(a, b) {
    let thoughtA = a.thought.toUpperCase();
    let thoughtB = b.thought.toUpperCase();
    if(thoughtA < thoughtB) {
      return 1;
    } else if(thoughtA > thoughtB) {
      return -1;
    }
    return 0;
  });
  emptyTable();
  sortedArray.forEach(item => {
    const row = addNewRow();
    addNewCell(row,item);
  });
}