// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// API Class for handling all backend requests
class API {
    // Projects API
    static async getProjects() {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    static async createProject(projectData) {
        try {
            const response = await fetch(`${API_BASE_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    static async updateProject(id, projectData) {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating project:', error);
            throw error;
        }
    }

    static async deleteProject(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    }

    // Tasks API
    static async getTasks(projectId) {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    static async createTask(projectId, taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    static async updateTask(id, taskData) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    static async deleteTask(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
}