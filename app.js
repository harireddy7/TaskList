const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const taskCount = document.querySelector('.task-count');

let dragStartIndex;

// Load All event Listeners
function loadAllEventListeners() {
  document.addEventListener('DOMContentLoaded', loadTasks);
  form.addEventListener('submit', addTask);
  taskList.addEventListener('click', deleteTask);
  clearBtn.addEventListener('click', clearTask);
  filter.addEventListener('keyup', filterTask);
}

function addDragDropEventListener(listItem) {
  // Drag Drop Events
  listItem.addEventListener('dragstart', dragStart);
  listItem.addEventListener('dragover', dragOver);
  listItem.addEventListener('dragenter', dragEnter);
  listItem.addEventListener('dragleave', dragLeave);
  listItem.addEventListener('drop', dragDrop);
}

// Get tasks from LS
function getTasks() {
  let tasks = [];
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  return tasks;
}

function loadTasks() {
  const tasks = getTasks();

  taskCount.textContent = `${tasks.length}`;

  tasks.forEach(task => {
    // create Task Li Element
    const li = document.createElement('li');
    li.className = 'collection-item draggable';
    li.setAttribute('draggable', 'true');

    li.appendChild(document.createTextNode(task));

    // Add Delete Icon
    const iconLink = document.createElement('a');
    iconLink.className = 'delete-item secondary-content btn-floating waves-effect waves-light red';
    iconLink.style.width = '20px';
    iconLink.style.height = '20px';
    iconLink.style.lineHeight = '20px';
    iconLink.innerHTML = '<i class="fa fa-remove" style="line-height: 20px; font-size: 1rem"></i>';

    li.appendChild(iconLink);

    taskList.appendChild(li);

    addDragDropEventListener(li);
  });
}

function storeTaskInLS(task) {
  const tasks = getTasks();

  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(e) {
  if (taskInput.value === '') {
    alert('Add a Task');
  } else {
    // create Task Li Element
    const li = document.createElement('li');
    li.className = 'collection-item draggable';

    li.setAttribute('draggable', true);

    li.appendChild(document.createTextNode(taskInput.value));

    // Add Delete Icon
    const iconLink = document.createElement('a');
    iconLink.className = 'delete-item secondary-content btn-floating waves-effect waves-light red';
    iconLink.style.width = '20px';
    iconLink.style.height = '20px';
    iconLink.style.lineHeight = '20px';
    iconLink.innerHTML = '<i class="fa fa-remove" style="line-height: 20px; font-size: 1rem"></i>';

    li.appendChild(iconLink);

    taskList.appendChild(li);

    taskCount.textContent = `${+taskCount.textContent + 1}`;

    addDragDropEventListener(li);

    storeTaskInLS(taskInput.value);

    // Clear text input
    taskInput.value = '';
  }

  e.preventDefault();
}

function deleteTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    if (confirm('Are you sure?')) {
      const taskEl = e.target.parentElement.parentElement;

      const colItems = document.querySelectorAll('.collection-item');
      const taskIndex = Array.from(colItems).findIndex(
        colItem => colItem.firstChild.textContent === taskEl.textContent
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

function filterTask(e) {
  const filterTxt = e.target.value.toLowerCase();
  const lis = document.querySelectorAll('.collection-item');

  lis.forEach(li => {
    if (li.firstChild.textContent.toLowerCase().includes(filterTxt)) {
      li.style.display = 'block';
    } else {
      li.style.display = 'none';
    }
  });
  e.preventDefault();
}

function clearTask(e) {
  while (taskList.firstChild) {
    taskList.firstChild.remove();
  }
  taskCount.textContent = 0;

  // Clear Tasks in LS
  localStorage.clear();

  e.preventDefault();
}

// get taskIndex
function getTaskIndex(el) {
  const colItems = document.querySelectorAll('.collection-item');
  const taskIndex = Array.from(colItems).findIndex(colItem => colItem.firstChild.textContent === el.textContent);
  return taskIndex;
}

function dragStart(e) {
  if (e.target.classList.contains('collection-item')) {
    dragStartIndex = getTaskIndex(e.target);
  }
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.target.classList.add('drag-active');
}

function dragLeave(e) {
  e.target.classList.remove('drag-active');
}

function dragDrop(e) {
  const dropIndex = getTaskIndex(e.target);
  if (dragStartIndex == dropIndex) {
    return;
  }
  const taskEls = document.querySelectorAll('.collection-item');
  const startEl = taskEls[dragStartIndex];

  // console.log(dragStartIndex, dropIndex);

  e.target.classList.remove('drag-active');
  taskList.removeChild(startEl);
  if (dropIndex === taskEls.length - 1) {
    taskEls[dropIndex].insertAdjacentElement('afterend', startEl);
  } else {
    taskEls[dropIndex].insertAdjacentElement('beforebegin', startEl);
  }
}

// Load All EventsListeners
loadAllEventListeners();
