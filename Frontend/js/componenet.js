// Component functions for rendering UI elements

// Render project card
function renderProjectCard(project) {
    return `
        <div class="project-card" data-project-id="${project.id}">
            <h3>${project.name}</h3>
            <p>${project.description || 'No description provided'}</p>
            <span class="project-status ${project.status}">${project.status}</span>
            <div class="project-actions">
                <button class="btn btn-primary view-project" data-project-id="${project.id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-warning edit-project" data-project-id="${project.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger delete-project" data-project-id="${project.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
}

// Render task card
function renderTaskCard(task) {
    const priorityClass = task.priority || 'medium';
    const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date';
    
    return `
        <div class="task-card" data-task-id="${task.id}">
            <h4>${task.title}</h4>
            <p>${task.description || 'No description'}</p>
            <div class="task-meta">
                <span class="task-priority ${priorityClass}">${task.priority || 'medium'}</span>
                <span class="task-assignee">${task.assignee || 'Unassigned'}</span>
            </div>
            <div class="task-meta">
                <span class="task-due-date">Due: ${dueDate}</span>
            </div>
            <div class="task-actions">
                <button class="btn btn-warning edit-task" data-task-id="${task.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger delete-task" data-task-id="${task.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
}

// Show loading state
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i> Loading...
        </div>
    `;
}

// Show empty state
function showEmptyState(containerId, message, icon = 'fas fa-inbox') {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="empty-state">
            <i class="${icon}"></i>
            <h3>${message}</h3>
        </div>
    `;
}

// Show error message
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button class="close-error">&times;</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
    
    // Remove on click
    errorDiv.querySelector('.close-error').addEventListener('click', () => {
        errorDiv.remove();
    });
}

// Show success message
function showSuccess(message) {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <button class="close-success">&times;</button>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
    
    // Remove on click
    successDiv.querySelector('.close-success').addEventListener('click', () => {
        successDiv.remove();
    });
}

// Format date for input
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Update task counts
function updateTaskCounts(tasks) {
    const todoCount = tasks.filter(task => task.status === 'todo').length;
    const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
    const doneCount = tasks.filter(task => task.status === 'done').length;
    
    document.getElementById('todoCount').textContent = todoCount;
    document.getElementById('inProgressCount').textContent = inProgressCount;
    document.getElementById('doneCount').textContent = doneCount;
}