const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// GET all tasks
app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new task
app.post('/todos', (req, res) => {
  const { todo: { title, status } } = req.body;
  db.run(
    'INSERT INTO todos (title, status) VALUES (?, ?)',
    [title, status || 'pending'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PUT (update) a task's status
app.put('/todos/:id', (req, res) => {
  const { todo: { status } } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE todos SET status = ? WHERE id = ?',
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Updated successfully' });
    }
  );
});

// DELETE a task
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
