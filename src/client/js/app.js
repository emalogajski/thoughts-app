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

const DATE = "DATE";
const THOUGHT = "THOUGHT"

const sorting = {
  type: DATE,
  ascending: false
}

const sortTable = () => {
  let sortingFunction;
  switch (sorting.type){
  case DATE:
    sortingFunction = !sorting.ascending ? sortByDateDescending : sortByDateAscending;
    break;
  case THOUGHT:
    sortingFunction = !sorting.ascending ? sortByThoughtsDescending : sortByThoughtsAscending;
    break;
  default:
    sortingFunction = () => {};
  }
  sortingFunction();
}

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

  const onSortButtonClick = type => ascending => {
    const didSwitchTypes = type !== sorting.type;
    sorting.type = type;
    sorting.ascending = didSwitchTypes ? true : ascending

    updateSortingIndicators()
    renderTable();
  }

  const onSortByDateClick = onSortButtonClick(DATE);
  const onSortByThoughtClick = onSortButtonClick(THOUGHT);
  
  sortDateButton.addEventListener('click', () => onSortByDateClick(!sorting.ascending));
  sortThoughtsButton.addEventListener('click', () => onSortByThoughtClick(!sorting.ascending));
}

const updateSortingIndicators = () =>{
  sortDateButton.classList.toggle('active', sorting.type === DATE);
  sortThoughtsButton.classList.toggle('active', sorting.type === THOUGHT);
  
  sortingDateImage = document.getElementById('sorting-image-for-date');
  sortingThoughtsImage = document.getElementById('sorting-image-for-thoughts');

  const activeIndicator = sorting.type === DATE ? sortingDateImage : sortingThoughtsImage;
  const inactiveIndicator = sorting.type === THOUGHT ? sortingDateImage : sortingThoughtsImage;

  inactiveIndicator.classList.value = "svg-inline--fa fa-sort fa-w-10";
  activeIndicator.classList.value = `svg-inline--fa fa-sort-${sorting.ascending ? 'up' : 'down'} fa-w-10`;
}

window.onload = init;

const renderTable = () => {
  emptyTable();
  sortTable()
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
  thoughtObjects.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });
}

const sortByDateDescending = () => {
  thoughtObjects.sort(function (a, b) {
    return b.timestamp - a.timestamp;
  });
}

const sortAscending = (a, b) => {
  let thoughtA = a.thought.toUpperCase();
  let thoughtB = b.thought.toUpperCase();
  if(thoughtA < thoughtB) {
    return -1;
  } else if(thoughtA > thoughtB) {
    return 1;
  }
  return 0;
}

const sortByThoughtsAscending = () => {
  thoughtObjects.sort(sortAscending);
}

const sortByThoughtsDescending = () => {
  thoughtObjects.sort((a,b) => sortAscending(b,a));
}
