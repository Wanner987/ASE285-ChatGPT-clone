const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json());

const db = new sqlite3.Database('./data/chat_history.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

// Create the table for your chatbot history
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT, 
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/api/save-chat', (req, res) => {
    const { role, content } = req.body;
    db.run(`INSERT INTO messages (role, content) VALUES (?, ?)`, [role, content], function(err) {
        if (err) return res.status(500).send(err.message);
        res.status(200).send({ id: this.lastID });
    });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));