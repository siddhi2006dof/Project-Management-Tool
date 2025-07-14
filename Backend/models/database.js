const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create projects table
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create tasks table
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'todo',
          priority TEXT DEFAULT 'medium',
          assignee TEXT,
          due_date DATE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects (id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};


module.exports = { db, initDatabase };