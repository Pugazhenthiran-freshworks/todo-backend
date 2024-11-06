const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./todos.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending', 'inProgress', 'completed')) NOT NULL DEFAULT 'pending'
    )
  `);
});

module.exports = db;
