const form = document.querySelector('#task-form');

const taskList = document.querySelector('.collection');

const taskInput = document.querySelector('#task');
const filter = document.querySelector('#filter');
const taskCount = document.querySelector('.task-count');
const clearBtn = document.querySelector('.clear-tasks');

// LOAD EVENT LISTENERS
function loadAllEventListeners() {
  document.addEventListener('DOMContentLoaded', loadTasks);
  form.addEventListener('submit', addTask);
  taskList.addEventListener('click', toggleTaskStatus);
  taskList.addEventListener('click', deleteTask);
  clearBtn.addEventListener('click', clearTask);
  filter.addEventListener('keyup', filterTask);
}

// GET TASKS FROM LOCAL STORAGE
function getTasks() {
  let tasks = [];
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  return tasks;
}

// LOAD TASKS TO UI
function loadTasks() {
  const tasks = getTasks();

  taskCount.textContent = `${tasks.length}`;

  tasks.forEach(taskObj => {
    // create Task Li Element
    const li = document.createElement('li');
    li.className = 'collection-item flex';

    const textNodeEl = document.createElement('div');
    textNodeEl.className = `text-task ${taskObj.done && 'strike'}`;
    textNodeEl.innerText = taskObj.task;
    li.appendChild(textNodeEl);

    // toggle complete checkbox
    const checkContainer = document.createElement('label');
    checkContainer.className = 'secondary-content task-check-box';
    checkContainer.innerHTML = `
      <input type="checkbox" class="filled-in" />
      <span></span>
    `;
    checkContainer.firstElementChild.checked = taskObj.done;

    li.appendChild(checkContainer);

    // Add Delete Icon
    const iconLink = document.createElement('div');
    iconLink.className = 'delete-item secondary-content btn-floating waves-effect waves-light red';
    iconLink.style.width = '20px';
    iconLink.style.height = '20px';
    iconLink.style.lineHeight = '20px';
    iconLink.innerHTML = '<i class="fa fa-remove" style="line-height: 20px; font-size: 1rem"></i>';

    li.appendChild(iconLink);

    taskList.appendChild(li);
  });
}

// STORE TASK IN LOCAL STORAGE
function storeTaskInLS(task) {
  const tasks = getTasks();

  tasks.push({ task, done: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ADD TASK
function addTask(e) {
  if (taskInput.value === '') {
    alert('Add a Task');
  } else {
    // create Task Li Element
    const li = document.createElement('li');
    li.className = 'collection-item flex';

    const textNodeEl = document.createElement('div');
    textNodeEl.className = 'text-task';
    textNodeEl.innerText = taskInput.value.trim();
    li.appendChild(textNodeEl);

    // toggle complete checkbox
    const checkContainer = document.createElement('label');
    checkContainer.className = 'secondary-content task-check-box';
    checkContainer.innerHTML = `
      <input type="checkbox" class="filled-in" />
      <span></span>
    `;

    li.appendChild(checkContainer);

    // Add Delete Icon
    const iconLink = document.createElement('div');
    iconLink.className = 'delete-item secondary-content btn-floating waves-effect waves-light red';
    iconLink.style.width = '20px';
    iconLink.style.height = '20px';
    iconLink.style.lineHeight = '20px';
    iconLink.innerHTML = '<i class="fa fa-remove" style="line-height: 20px; font-size: 1rem"></i>';

    li.appendChild(iconLink);

    const taskItems = document.querySelectorAll('.collection-item');
    if (taskItems.length) {
      taskList.insertBefore(li, taskItems[0]);
    } else {
      taskList.appendChild(li);
    }

    taskCount.textContent = `${+taskCount.textContent + 1}`;

    storeTaskInLS(taskInput.value);

    // Clear text input
    taskInput.value = '';
  }

  e.preventDefault();
}

// TOGGLE TASK STATUS
function toggleTaskStatus(e) {
  if (e.target.parentElement.classList.contains('task-check-box')) {
    const checkEl = e.target.parentElement.firstElementChild;
    checkEl.checked = !checkEl.checked;

    const taskTextEl = e.target.parentElement.previousSibling;
    taskTextEl.classList.toggle('strike');

    let tasks = getTasks();
    const revisedTasks = tasks.map(taskObj => {
      if (taskObj.task === taskTextEl.textContent.trim()) {
        return { ...taskObj, done: !taskObj.done };
      }
      return taskObj;
    });

    localStorage.setItem('tasks', JSON.stringify(revisedTasks));
  }

  e.preventDefault();
}

// DELETE TASK
function deleteTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    if (confirm('Are you sure?')) {
      const taskEl = e.target.parentElement.parentElement;

      const taskItems = document.querySelectorAll('.collection-item');
      const taskIndex = Array.from(taskItems).findIndex(
        colItem => colItem.firstChild.textContent === taskEl.textContent.trim()
      );

      let tasks = getTasks();
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }

      localStorage.setItem('tasks', JSON.stringify(tasks));
      taskEl.remove();
      taskCount.textContent = `${+taskCount.textContent - 1}`;
    }
  }

  e.preventDefault();
}

// FILTER TASK
function filterTask(e) {
  const filterTxt = e.target.value.toLowerCase();

  const taskItems = document.querySelectorAll('.collection-item');
  taskItems.forEach(li => {
    if (li.firstChild.textContent.toLowerCase().includes(filterTxt)) {
      li.style.display = 'flex';
    } else {
      li.style.display = 'none';
    }
  });
  e.preventDefault();
}

// CLEAR TASKS

function clearTask(e) {
  while (taskList.firstChild) {
    taskList.firstChild.remove();
  }
  taskCount.textContent = 0;

  // Clear Tasks in LS
  localStorage.removeItem('tasks');

  e.preventDefault();
}

// Load All EventsListeners
loadAllEventListeners();
