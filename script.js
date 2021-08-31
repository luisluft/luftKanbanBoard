// Multiple elements
const addButtons = document.querySelectorAll(".add-button:not(.solid)");
const saveItemButtons = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
const listColumns = document.querySelectorAll(".drag-item-list");

// Single elements
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem = "";
let currentColumn = "";

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Create DOM Elements for each list item
function createItemElements(columnElement, column, item, index) {
  // console.log("columnElement:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // List Item
  const listElement = document.createElement("li");
  listElement.classList.add("drag-item");
  listElement.textContent = item;
  listElement.draggable = true;
  listElement.setAttribute("ondragstart", "dragItem(event)");
  columnElement.appendChild(listElement);
}

function dragItem(event) {
  draggedItem = event.target;
  console.log("draggedItem :", draggedItem);
}

function allowDrop(event) {
  event.preventDefault();
}

function dropItem(event) {
  event.preventDefault();

  // Remove background color
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });

  // Add item to the column
  const droppedColumn = listColumns[currentColumn];
  console.log("droppedColumn :", droppedColumn);
  droppedColumn.appendChild(draggedItem);
}

function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumns();

  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemElements(backlogList, 0, backlogItem, index);
  });

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemElements(progressList, 0, progressItem, index);
  });

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemElements(completeList, 0, completeItem, index);
  });

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemElements(onHoldList, 0, onHoldItem, index);
  });

  // Run getSavedColumns only once, Update Local Storage
}

// On Load
updateDOM();
