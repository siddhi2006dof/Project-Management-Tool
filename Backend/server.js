const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

// Import database
const { initDatabase } = require('./models/database');



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Serve static files from frontend (optional)
app.use(express.static(path.join(__dirname, 'frontend')));


// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Project Management API is running!' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});