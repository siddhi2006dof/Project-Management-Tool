// script.js

const form = document.getElementById('project-form');
const input = document.getElementById('project-name');
const list = document.getElementById('project-list');

// Form submit: Add project
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const projectName = input.value.trim();
  if (projectName === '') return;

  const projectContainer = document.createElement('li');
  projectContainer.innerHTML = `
    <strong>📁 ${projectName}</strong>
    <ul class="task-list"></ul>
    <form class="task-form">
      <input type="text" class="task-input" placeholder="Add task" required />
      <button type="submit">Add Task</button>
    </form>
  `;

  // Add project to list
  list.appendChild(projectContainer);
  input.value = '';

  // Add event listener for task form
  const taskForm = projectContainer.querySelector('.task-form');
  const taskList = projectContainer.querySelector('.task-list');

  taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskInput = taskForm.querySelector('.task-input');
  const taskName = taskInput.value.trim();
  if (taskName === '') return;

  const taskItem = document.createElement('li');
  taskItem.innerHTML = `
    <input type="checkbox" class="task-check" />
    <span>${taskName}</span>
    <button type="button" class="delete-btn">🗑️</button>
  `;

  taskList.appendChild(taskItem);
  taskInput.value = '';

  const deleteBtn = taskItem.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    taskItem.remove();
  });
});

  });

