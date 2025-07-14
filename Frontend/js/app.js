// Global variables
let currentProject = null;
let currentEditingProject = null;
let currentEditingTask = null;
let projects = [];
let tasks = [];

// DOM elements
const projectsSection = document.getElementById('projectsSection');
const tasksSection = document.getElementById('tasksSection');
const projectsGrid = document.getElementById('projectsGrid');
const projectModal = document.getElementById('projectModal');
const taskModal = document.getElementById('taskModal');
const projectForm = document.getElementById('projectForm');
const taskForm = document.getElementById('taskForm');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Initialize the application
async function initializeApp() {
    try {
        await loadProjects();
        showProjectsView();
    } catch (error) {
        showError('Failed to load projects');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Project modal events
    document.getElementById('addProjectBtn').addEventListener('click', openProjectModal);
    document.getElementById('closeProjectModal').addEventListener('click', closeProjectModal);
    document.getElementById('cancelProject').addEventListener('click', closeProjectModal);
    projectForm.addEventListener('submit', handleProjectSubmit);

    // Task modal events
    document.getElementById('addTaskBtn').addEventListener('click', openTaskModal);
    document.getElementById('closeTaskModal').addEventListener('click', closeTaskModal);
    document.getElementById('cancelTask').addEventListener('click', closeTaskModal);
    taskForm.addEventListener('submit', handleTaskSubmit);

    // Navigation events
    document.getElementById('backToProjects').addEventListener('click', showProjectsView);

    // Search functionality
    document.getElementById('searchProjects').addEventListener('input', handleProjectSearch);

    // Close modals on outside click
    window.addEventListener('click', function(event) {
        if (event.target === projectModal) {
            closeProjectModal();
        }
        if (event.target === taskModal) {
            closeTaskModal();
        }
    });

    // Project actions (delegated events)
    projectsGrid.addEventListener('click', handleProjectActions);

    // Task actions (delegated events)
    document.getElementById('todoTasks').addEventListener('click', handleTaskActions);
    document.getElementById('inProgressTasks').addEventListener('click', handleTaskActions);
    document.getElementById('doneTasks').addEventListener('click', handleTaskActions);
}

// Load projects from API
async function loadProjects() {
    try {
        showLoading('projectsGrid');
        projects = await API.getProjects();
        renderProjects(projects);
    } catch (error) {
        showError('Failed to load projects');
        showEmptyState('projectsGrid', 'Failed to load projects', 'fas fa-exclamation-triangle');
    }
}

// Render projects
function renderProjects(projectsToRender) {
    if (projectsToRender.length === 0) {
        showEmptyState('projectsGrid', 'No projects found. Create your first project!', 'fas fa-plus-circle');
        return;
    }

    projectsGrid.innerHTML = projectsToRender.map(project => renderProjectCard(project)).join('');
}

// Handle project actions
function handleProjectActions(event) {
    const target = event.target.closest('button');
    if (!target) return;

    const projectId = target.dataset.projectId;
    const action = target.classList.contains('view-project') ? 'view' :
                  target.classList.contains('edit-project') ? 'edit' :
                  target.classList.contains('delete-project') ? 'delete' : null;

    switch (action) {
        case 'view':
            viewProject(projectId);
            break;
        case 'edit':
            editProject(projectId);
            break;
        case 'delete':
            deleteProject(projectId);
            break;
    }
}

// View project tasks
async function viewProject(projectId) {
    try {
        currentProject = projects.find(p => p.id == projectId);
        if (!currentProject) return;

        document.getElementById('currentProjectTitle').textContent = currentProject.name;
        await loadTasks(projectId);
        showTasksView();
    } catch (error) {
        showError('Failed to load project tasks');
    }
}

// Load tasks for a project
async function loadTasks(projectId) {
    try {
        tasks = await API.getTasks(projectId);
        renderTasks(tasks);
    } catch (error) {
        showError('Failed to load tasks');
    }
}

// Render tasks in kanban columns
function renderTasks(tasksToRender) {
    const todoTasks = tasksToRender.filter(task => task.status === 'todo');
    const inProgressTasks = tasksToRender.filter(task => task.status === 'in-progress');
    const doneTasks = tasksToRender.filter(task => task.status === 'done');

    document.getElementById('todoTasks').innerHTML = todoTasks.map(task => renderTaskCard(task)).join('');
    document.getElementById('inProgressTasks').innerHTML = inProgressTasks.map(task => renderTaskCard(task)).join('');
    document.getElementById('doneTasks').innerHTML = doneTasks.map(task => renderTaskCard(task)).join('');

    updateTaskCounts(tasksToRender);
}

// Handle task actions
function handleTaskActions(event) {
    const target = event.target.closest('button');
    if (!target) return;

    const taskId = target.dataset.taskId;
    const action = target.classList.contains('edit-task') ? 'edit' :
                  target.classList.contains('delete-task') ? 'delete' : null;

    switch (action) {
        case 'edit':
            editTask(taskId);
            break;
        case 'delete':
            deleteTask(taskId);
            break;
    }
}

// Project modal functions
function openProjectModal(project = null) {
    currentEditingProject = project;
    const isEditing = project !== null;
    
    document.getElementById('projectModalTitle').textContent = isEditing ? 'Edit Project' : 'Add New Project';
    document.getElementById('saveProject').textContent = isEditing ? 'Update Project' : 'Save Project';
    
    if (isEditing) {
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectDescription').value = project.description || '';
    } else {
        projectForm.reset();
    }
    
    projectModal.style.display = 'block';
}

function closeProjectModal() {
    projectModal.style.display = 'none';
    currentEditingProject = null;
    projectForm.reset();
}

// Task modal functions
function openTaskModal(task = null) {
    currentEditingTask = task;
    const isEditing = task !== null;
    
    document.getElementById('taskModalTitle').textContent = isEditing ? 'Edit Task' : 'Add New Task';
    document.getElementById('saveTask').textContent = isEditing ? 'Update Task' : 'Save Task';
    
    if (isEditing) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskPriority').value = task.priority || 'medium';
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskAssignee').value = task.assignee || '';
        document.getElementById('taskDueDate').value = formatDateForInput(task.due_date);
    } else {
        taskForm.reset();
    }
    
    taskModal.style.display = 'block';
}

function closeTaskModal() {
    taskModal.style.display = 'none';
    currentEditingTask = null;
    taskForm.reset();
}

// Handle project form submission
async function handleProjectSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(projectForm);
    const projectData = {
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        status: 'active'
    };

    try {
        if (currentEditingProject) {
            await API.updateProject(currentEditingProject.id, projectData);
            showSuccess('Project updated successfully');
        } else {
            await API.createProject(projectData);
            showSuccess('Project created successfully');
        }
        
        closeProjectModal();
        await loadProjects();
    } catch (error) {
        showError('Failed to save project');
    }
}

// Handle task form submission
async function handleTaskSubmit(event) {
    event.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        assignee: document.getElementById('taskAssignee').value,
        due_date: document.getElementById('taskDueDate').value
    };

    try {
        if (currentEditingTask) {
            await API.updateTask(currentEditingTask.id, taskData);
            showSuccess('Task updated successfully');
        } else {
            await API.createTask(currentProject.id, taskData);
            showSuccess('Task created successfully');
        }
        
        closeTaskModal();
        await loadTasks(currentProject.id);
    } catch (error) {
        showError('Failed to save task');
    }
}

// Edit project
function editProject(projectId) {
    const project = projects.find(p => p.id == projectId);
    if (project) {
        openProjectModal(project);
    }
}

// Delete project
async function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
        try {
            await API.deleteProject(projectId);
            showSuccess('Project deleted successfully');
            await loadProjects();
        } catch (error) {
            showError('Failed to delete project');
        }
    }
}

// Edit task
function editTask(taskId) {
    const task = tasks.find(t => t.id == taskId);
    if (task) {
        openTaskModal(task);
    }
}

// Delete task
async function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await API.deleteTask(taskId);
            showSuccess('Task deleted successfully');
            await loadTasks(currentProject.id);
        } catch (error) {
            showError('Failed to delete task');
        }
    }
}

// Show projects view
function showProjectsView() {
    projectsSection.style.display = 'block';
    tasksSection.style.display = 'none';
    currentProject = null;
}

// Show tasks view
function showTasksView() {
    projectsSection.style.display = 'none';
    tasksSection.style.display = 'block';
}

// Handle project search
function handleProjectSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm) ||
        (project.description && project.description.toLowerCase().includes(searchTerm))
    );
    renderProjects(filteredProjects);
}