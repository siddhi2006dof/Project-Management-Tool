const express = require('express');
const router = express.Router();
const path = require('path');
const { db } = require(path.resolve(__dirname, '../models/database.js'));



// Get all projects
router.get('/', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new project
router.post('/', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  db.run(
    'INSERT INTO projects (name, description) VALUES (?, ?)',
    [name, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name,
        description,
        status: 'active'
      });
    }
  );
});

// Update project
router.put('/:id', (req, res) => {
  const { name, description, status } = req.body;
  const id = req.params.id;

  db.run(
    'UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?',
    [name, description, status, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Project updated successfully' });
    }
  );
});

// Delete project
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  // First delete all tasks associated with this project
  db.run('DELETE FROM tasks WHERE project_id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Then delete the project
    db.run('DELETE FROM projects WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Project deleted successfully' });
    });
  });
});

// Get tasks for a specific project
router.get('/:projectId/tasks', (req, res) => {
  const projectId = req.params.projectId;
  
  db.all(
    'SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC',
    [projectId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Create new task for a project
router.post('/:projectId/tasks', (req, res) => {
  const projectId = req.params.projectId;
  const { title, description, priority, assignee, due_date } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  db.run(
    'INSERT INTO tasks (project_id, title, description, priority, assignee, due_date) VALUES (?, ?, ?, ?, ?, ?)',
    [projectId, title, description, priority, assignee, due_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        project_id: projectId,
        title,
        description,
        status: 'todo',
        priority,
        assignee,
        due_date
      });
    }
  );
});

module.exports = router;


