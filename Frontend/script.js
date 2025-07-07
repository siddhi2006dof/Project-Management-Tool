let currentProject = null;

document.getElementById('project-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('project-name').value;
  const desc = document.getElementById('project-desc').value;
  const projectList = document.getElementById('project-list');

  const li = document.createElement('li');
  li.textContent = `${name} - ${desc}`;
  li.style.cursor = 'pointer';

  li.addEventListener('click', function () {
    currentProject = name;
    document.getElementById('task-list').innerHTML = '';
  });

  projectList.appendChild(li);

  document.getElementById('project-form').reset();
});

document.getElementById('task-form').addEventListener('submit', function (e) {
  e.preventDefault();

  if (!currentProject) {
    alert('Please select a project first.');
    return;
  }

  const taskName = document.getElementById('task-name').value;
  const taskStatus = document.getElementById('task-status').value;
  const taskList = document.getElementById('task-list');

  const li = document.createElement('li');
  li.textContent = `${taskName} [${taskStatus}]`;

  taskList.appendChild(li);
  document.getElementById('task-form').reset();
});
