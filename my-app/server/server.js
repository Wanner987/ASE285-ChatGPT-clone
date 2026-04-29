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
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER, 
    role TEXT, 
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// post 
app.post('/api/save_chat', (req, res) => {
    const { chat_id, role, content } = req.body;

    // 1. Determine the ID (if no chat_id provided, we'll generate a new one)
    // We use a timestamp or a random number if chat_id is null
    const targetChatId = chat_id || Date.now(); 

    // 2. Insert the new message
    const insertSql = `INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)`;
    
    db.run(insertSql, [targetChatId, role, content], function(err) {
        if (err) return res.status(500).json({ error: err.message });

        // 3. IMMEDIATELY fetch the whole history for this chat_id to return to React
        const selectSql = `SELECT role, content, timestamp FROM messages WHERE chat_id = ? ORDER BY timestamp ASC`;
        
        db.all(selectSql, [targetChatId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            // 4. Send back the chat_id and the full list of messages
            res.status(200).json({
                chat_id: targetChatId,
                history: rows
            });
        });
    });
});

// get the first message of each chat for the history page
app.get('/api/history', (req, res) => {
    // This query finds the first message for every unique chat_id
    const sql = `
        SELECT chat_id, content, MIN(timestamp) as time
        FROM messages 
        WHERE role = 'user'
        GROUP BY chat_id 
        ORDER BY timestamp DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Returns an array of objects: [{chat_id: 123, content: "Hello AI", time: "..."}, ...]
        res.status(200).json(rows);
    });
});

// get the full history of a specific chat_id for the chat page
app.get('/api/history/:chat_id', (req, res) => {
    const { chat_id } = req.params;

    // We fetch a few extra messages (e.g., 15) to ensure we have 
    // enough room to find a starting "user" message while still 
    // ending up with roughly 10.
    const sql = `
        SELECT role, content, timestamp 
        FROM messages 
        WHERE chat_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 15
    `;

    db.all(sql, [chat_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // 1. SQL 'ORDER BY DESC' gives us newest first. 
        // We reverse it immediately to get chronological order.
        let history = rows.reverse();

        // 2. Logic: Remove messages from the start until the first message is 'user'
        while (history.length > 0 && history[0].role !== 'user') {
            history.shift();
        }

        // 3. Finally, ensure we only return the latest 10 (or fewer)
        const finalHistory = history.slice(-10);

        res.status(200).json(finalHistory);
    });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));