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
let dragging = false;
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
  // List Item
  const listElement = document.createElement("li");
  listElement.classList.add("drag-item");
  listElement.textContent = item;
  listElement.draggable = true;
  listElement.setAttribute("ondragstart", "dragItem(event)");
  listElement.contentEditable = true;
  listElement.id = index;
  listElement.setAttribute("onfocusout", `updateItem(${index},${column})`);
  columnElement.appendChild(listElement);
}

function dragItem(event) {
  dragging = true;
  draggedItem = event.target;
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
  droppedColumn.appendChild(draggedItem);
  saveDragAndDroppedItems();

  dragging = false;
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
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemElements(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemElements(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemElements(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// aka rebuildArrays()
function saveDragAndDroppedItems() {
  // Save each item on each column to their corresponding array
  backlogListArray = Array.from(backlogList.children).map((item) => item.textContent);
  progressListArray = Array.from(progressList.children).map((item) => item.textContent);
  completeListArray = Array.from(completeList.children).map((item) => item.textContent);
  onHoldListArray = Array.from(onHoldList.children).map((item) => item.textContent);

  updateDOM();
}

function showInputBox(column) {
  addButtons[column].style.visibility = "hidden";
  saveItemButtons[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

function saveInputBox(column) {
  addButtons[column].style.visibility = "visible";
  saveItemButtons[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  saveToColumn(column);
}

function saveToColumn(column) {
  const itemText = addItems[column].textContent;
  addItems[column].textContent = "";

  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  updateDOM();
}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedElement = listColumns[column].children;

  if (!dragging) {
    if (!selectedElement[id].textContent) delete selectedArray[id];
    else selectedArray[id] = selectedElement[id].textContent;
    updateDOM();
  }
}

function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);

  return filteredArray;
}

// On Load
updateDOM();

function touchHandler(event) {
  var touch = event.changedTouches[0];

  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(
    {
      touchstart: "mousedown",
      touchmove: "mousemove",
      touchend: "mouseup",
    }[event.type],
    true,
    true,
    window,
    1,
    touch.screenX,
    touch.screenY,
    touch.clientX,
    touch.clientY,
    false,
    false,
    false,
    false,
    0,
    null
  );

  touch.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
}

function init() {
  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);
}
