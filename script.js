import { saveTasks, loadTasks } from './storage.js';
import { debounce, throttle } from './utils.js';

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');
const clearAllBtn = document.getElementById('clear-all');
const backToTopBtn = document.getElementById('back-to-top');

let tasks = loadTasks();

function renderTasks(filter = '') {
  taskList.innerHTML = '';
  tasks
    .filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
    .forEach((task, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="${task.completed ? 'task-complete' : ''}">${task.text}</span>
        <div>
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}" class="toggle">
          <button data-index="${index}" class="delete">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  saveTasks(tasks);
  renderTasks();
  taskInput.value = '';
}

function handleListClick(e) {
  const index = e.target.dataset.index;
  if (e.target.classList.contains('delete')) {
    tasks.splice(index, 1);
  } else if (e.target.classList.contains('toggle')) {
    tasks[index].completed = !tasks[index].completed;
  }
  saveTasks(tasks);
  renderTasks(searchInput.value);
}

function clearAllTasks() {
  tasks = [];
  saveTasks(tasks);
  renderTasks();
}

function handleScroll() {
  backToTopBtn.style.display = window.scrollY > 100 ? 'block' : 'none';
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleListClick);
clearAllBtn.addEventListener('click', clearAllTasks);
searchInput.addEventListener('input', debounce(() => renderTasks(searchInput.value), 300));
window.addEventListener('scroll', throttle(handleScroll, 200));
backToTopBtn.addEventListener('click', scrollToTop);

renderTasks();
