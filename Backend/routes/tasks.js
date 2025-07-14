const express = require('express');
const router = express.Router();
const path = require('path');
const { db } = require(path.resolve(__dirname, '../models/database.js'));



// Update task
router.put('/:id', (req, res) => {
  const { title, description, status, priority, assignee, due_date } = req.body;
  const id = req.params.id;

  db.run(
    'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, assignee = ?, due_date = ? WHERE id = ?',
    [title, description, status, priority, assignee, due_date, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Task updated successfully' });
    }
  );
});

// Delete task
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// Get single task
router.get('/:id', (req, res) => {
  const id = req.params.id;
  
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(row);
  });
});

module.exports = router;