const taskForm = document.querySelector(".app-form");
const createTaskBtn = document.querySelector(".create-task-button");
const taskContent = document.querySelector(".task-content");
const listOfTasks = document.querySelector(".list-of-tasks");
const taskContainer = document.querySelector(".task-container");

const displayTasks = document.querySelector(".all-button");
const displayActive = document.querySelector(".active-button");
const displayCompleted = document.querySelector(".completed-button");

let editFlag = false;

// Run App on launch, get data from local storage and create tasks
const setupApp = () => {
  let elements = getDataFromLocalStorage();

  if (elements.length > 0) {
    elements.forEach((item) => {
      createTask(item.id, item.value, item.status, item.important);
    });
    taskContainer.classList.add("show-task-container");
  }
};

// Create new task on click
const addTask = (e) => {
  e.preventDefault();

  const taskValue = taskContent.value;
  const id = (Date.now() * 0x10000).toString(16).substring(1);
  let taskStatus = "active";
  let isImportant = "false";

  if (taskValue) {
    // Check if input contains any value, if true create task
    createTask(id, taskValue, taskStatus, isImportant);
    taskContainer.classList.add("show-task-container");
    addToLocalStorage(id, taskValue, taskStatus, isImportant); //push data to local storage
    setInputToDefault();
  }
};

// Get list of tasks as data stored in local storagee
const getDataFromLocalStorage = () => {
  return localStorage.getItem("list-of-tasks")
    ? JSON.parse(localStorage.getItem("list-of-tasks"))
    : [];
};

const addToLocalStorage = (id, value, status, important) => {
  const tasks = { id, value, status, important };
  let elements = getDataFromLocalStorage();

  elements.push(tasks);
  localStorage.setItem("list-of-tasks", JSON.stringify(elements));
};

const setInputToDefault = () => {
  taskContent.value = "";
};

const highlightTask = (e) => {
  const element = e.currentTarget.parentElement.parentElement;

  let taskID = element.dataset.id;
  let isImportant = element.dataset.important;

  element.classList.toggle("important-task");
  if (element.classList.contains("important-task")) {
    isImportant = "true";
    element.setAttribute("is-important", "true");
  } else {
    isImportant = "false";
    element.setAttribute("is-important", "no");
  }

  changeImportantInLocalStorage(taskID, isImportant ?? "false");
};

const changeImportantInLocalStorage = (id, isImportant) => {
  let elements = getDataFromLocalStorage();

  elements = elements.map((item) => {
    if (item.id === id) {
      item.important = isImportant;
    }
    return item;
  });
  localStorage.setItem("list-of-tasks", JSON.stringify(elements));
};

const editTaskContent = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const editElement = element.querySelector(".task-description");
  if (editFlag === false) {
    editElement.contentEditable = true;
    editElement.classList.add("editing-task");
    editFlag = true;
  } else if (editFlag === true) {
    editElement.contentEditable = false;
    editElement.classList.remove("editing-task");
    editDataInLocalStorage(element.dataset.id, editElement.textContent);
    editFlag = false;
  }
};

const editDataInLocalStorage = (id, value) => {
  let elements = getDataFromLocalStorage();

  elements = elements.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list-of-tasks", JSON.stringify(elements));
};

const changeStatusInLocalStorage = (id, dataStatus) => {
  let elements = getDataFromLocalStorage();

  elements = elements.map((item) => {
    if (item.id === id) {
      item.status = dataStatus;
    }
    return item;
  });
  localStorage.setItem("list-of-tasks", JSON.stringify(elements));
};

const deleteTask = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  listOfTasks.removeChild(element);
  if (listOfTasks.children.length === 0) {
    taskContainer.classList.remove("show-task-container");
  }

  removeDataFromLocalStorage(id);
};

const removeDataFromLocalStorage = (id) => {
  let elements = getDataFromLocalStorage();

  elements = elements.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list-of-tasks", JSON.stringify(elements));
};

const taskCompleted = (e) => {
  const element = e.currentTarget.parentElement;
  const buttonImportant = element.querySelector(".btn-important");
  const buttonEdit = element.querySelector(".btn-edit");
  const editElement = element.querySelector(".task-description");
  const checkBox = e.currentTarget;

  let taskID = element.dataset.id;
  let taskStatus = element.dataset.status;
  let isImportant = element.dataset.important;
  if (checkBox.checked) {
    element.classList.add("completed");
    element.classList.remove("active-task");
    editElement.classList.remove("editing-task");
    editFlag = false;
    editElement.contentEditable = false;
    element.classList.remove("important-task");
    buttonImportant.style.visibility = "hidden";
    buttonEdit.style.visibility = "hidden";
    taskStatus = "completed";
    changeImportantInLocalStorage(taskID, isImportant ?? "false");
    element.setAttribute("task-status", "completed");
    changeStatusInLocalStorage(taskID, taskStatus);
  } else {
    element.classList.remove("completed");
    element.classList.add("active-task");
    buttonImportant.style.visibility = "visible";
    buttonEdit.style.visibility = "visible";
    taskStatus = "active";
    element.setAttribute("task-status", "active");
    changeStatusInLocalStorage(taskID, taskStatus);
  }
};

const createTask = (id, value, status, important) => {
  const task = document.createElement("article");
  task.classList.add("task");
  const attribute = document.createAttribute("data-id");
  const attributeStatus = document.createAttribute("task-status");
  const markAsImportant = document.createAttribute("is-important");
  attribute.value = id;
  attributeStatus.value = status;
  markAsImportant.value = important;
  task.setAttributeNode(attribute);
  task.setAttributeNode(attributeStatus);
  task.setAttributeNode(markAsImportant);
  if (important == "true") {
    task.classList.add("important-task");
  }
  if (status == "completed") {
    task.classList.add("completed");
  } else {
    task.classList.add("active-task");
  }

  task.innerHTML = `<input type="checkbox" class="checkbox-task" />
   <p class="task-description">${value}</p>
   <div class="task-btns-container">
      <button type="button" class="task-button btn-edit">
         <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button type="button" class="task-button btn-important">
         <i class="fa-solid fa-exclamation"></i>
      </button>
      <button type="button" class="task-button btn-delete">
         <i class="fa-solid fa-trash-can"></i>
      </button>
   </div>`;

  const buttonImportant = task.querySelector(".btn-important");
  const buttonEdit = task.querySelector(".btn-edit");
  const buttonDelete = task.querySelector(".btn-delete");
  const checkTask = task.querySelector(".checkbox-task");

  buttonImportant.addEventListener("click", highlightTask);
  buttonEdit.addEventListener("click", editTaskContent);
  buttonDelete.addEventListener("click", deleteTask);
  checkTask.addEventListener("click", taskCompleted);

  if (status == "completed") {
    checkTask.checked = true;
    buttonImportant.style.visibility = "hidden";
    buttonEdit.style.visibility = "hidden";
  }

  //append element to container
  listOfTasks.appendChild(task);
};

const filterCompletedTasks = () => {
  let tasks = listOfTasks.querySelectorAll(".task");

  tasks.forEach((item) => {
    if (item.classList.contains("completed")) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

const filterActiveTasks = () => {
  let tasks = listOfTasks.querySelectorAll(".task");

  tasks.forEach((item) => {
    if (item.classList.contains("active-task")) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

const displayListOfTasks = () => {
  let tasks = listOfTasks.querySelectorAll(".task");
  tasks = [...tasks];
  tasks.forEach((item) => {
    if (item.classList.contains("task")) {
      item.style.display = "flex";
    }
  });
};

taskForm.addEventListener("submit", addTask);

displayTasks.addEventListener("click", () => {
  displayTasks.style.backgroundColor = "var(--secondary)";
  displayActive.style.backgroundColor = "transparent";
  displayCompleted.style.backgroundColor = "transparent";
  displayTasks.style.borderColor = "var(--secondary)";
  displayActive.style.borderColor = "var(--font-color-basic)";
  displayCompleted.style.borderColor = "var(--font-color-basic)";
  displayListOfTasks();
});

displayActive.addEventListener("click", () => {
  displayTasks.style.backgroundColor = "transparent";
  displayActive.style.backgroundColor = "var(--tertiary)";
  displayCompleted.style.backgroundColor = "transparent";
  displayTasks.style.borderColor = "var(--font-color-basic)";
  displayActive.style.borderColor = "var(--tertiary)";
  displayCompleted.style.borderColor = "var(--font-color-basic)";
  filterActiveTasks();
});

displayCompleted.addEventListener("click", () => {
  displayTasks.style.backgroundColor = "transparent";
  displayActive.style.backgroundColor = "transparent";
  displayCompleted.style.backgroundColor = "var(--quaternary)";
  displayTasks.style.borderColor = "var(--font-color-basic)";
  displayActive.style.borderColor = "var(--font-color-basic)";
  displayCompleted.style.borderColor = "var(--quaternary)";
  filterCompletedTasks();
});

window.addEventListener("DOMContentLoaded", setupApp);
