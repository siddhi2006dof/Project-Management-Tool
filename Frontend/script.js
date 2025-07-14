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
  //Backened me post krna start krege 
  fetch('/api/tasks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        project: currentProject,
        name: taskName,
        status: taskStatus
    })
})
.then(() => {
    document.getElementById('task-form').reset();
    loadTasks(); // function banaenge jisme backend se fetch karenge
});

  const li = document.createElement('li');
  li.textContent = `${taskName} [${taskStatus}]`;

  taskList.appendChild(li);
  document.getElementById('task-form').reset();
});
 function loadTasks() {
  fetch('/api/tasks')
    .then(res => res.json())
    .then(data => {
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = '';

      data.filter(task => task.project === currentProject)
        .forEach((task, index) => {
          const li = document.createElement('li');
          li.textContent = '${task.name} (${task.status})';

          const delBtn = document.createElement('button');
          delBtn.textContent = 'Delete';
          delBtn.style.backgroundColor = 'red';  // 🔴 red background
          delBtn.style.color = 'white';         // ⚪ white text
          delBtn.onclick = () => deleteTask(index);

          li.appendChild(delBtn);
          taskList.appendChild(li);
          
        });
    }); // ✅ Correct closing of .then(data => {...})
    loadTasks();
} // ✅ Closing of loadTasks()

