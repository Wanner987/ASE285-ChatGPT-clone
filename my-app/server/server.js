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
    parts TEXT,  
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// post 
app.post('/api/save_chat', (req, res) => {
    const { chat_id, role, parts } = req.body; // Expecting 'parts' as an array

    const targetChatId = chat_id || Date.now(); 

    // 1. Convert the parts array to a JSON string for storage
    const partsJson = JSON.stringify(parts);
    const insertSql = `INSERT INTO messages (chat_id, role, parts) VALUES (?, ?, ?)`;
    
    db.run(insertSql, [targetChatId, role, partsJson], function(err) {
        if (err) return res.status(500).json({ error: err.message });

        const selectSql = `SELECT role, parts, timestamp FROM messages WHERE chat_id = ? ORDER BY timestamp ASC`;
        
        db.all(selectSql, [targetChatId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            // 2. Map through rows to parse the 'parts' string back into a real JS array
            const history = rows.map(row => ({
                role: row.role,
                parts: JSON.parse(row.parts),
                timestamp: row.timestamp
            }));

            res.status(200).json({
                chat_id: targetChatId,
                history: history
            });
        });
    });
});

// get the first message of each chat for the history page
app.get('/api/history', (req, res) => {
    // This query finds the first message for every unique chat_id
    const sql = `
        SELECT chat_id, parts, MIN(timestamp) as time
        FROM messages 
        WHERE role = 'user'
        GROUP BY chat_id 
        ORDER BY timestamp DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Returns an array of objects: [{chat_id: 123, parts: [...], time: "..."}, ...]
        const formattedRows = rows.map(row => ({
            chat_id: row.chat_id,
            parts: JSON.parse(row.parts), // Convert the string back to an array
            time: row.time
        }));
        
        res.status(200).json(formattedRows);
    });
});

// get the full history of a specific chat_id for the chat page
app.get('/api/history/:chat_id', (req, res) => {
    const { chat_id } = req.params;

    // We fetch a few extra messages (e.g., 15) to ensure we have 
    // enough room to find a starting "user" message while still 
    // ending up with roughly 10.
    const sql = `
        SELECT role, parts, timestamp
        FROM messages 
        WHERE chat_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 15
    `;

    db.all(sql, [chat_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // 'ORDER BY DESC' gives us newest first. 
        // We reverse it immediately to get chronological order.
        let history = rows.reverse();

        history = rows.map(row => ({
            role: row.role,
            parts: JSON.parse(row.parts),
            timestamp: row.timestamp
        }));

        // Remove messages from the start until the first message is 'user'
        while (history.length > 0 && history[0].role !== 'user') {
            history.shift();
        }

        // 3. Finally, ensure we only return the latest 10 (or fewer)
        const finalHistory = history.slice(-10);

        res.status(200).json(finalHistory);
    });
});

// 1. Delete a specific chat by its ID
app.delete('/api/history/:chat_id', (req, res) => {
    const { chat_id } = req.params;
    const sql = `DELETE FROM messages WHERE chat_id = ?`;

    db.run(sql, [chat_id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // 'this.changes' returns the number of rows deleted
        res.status(200).json({ 
            message: `Deleted chat ${chat_id}`, 
            deletedCount: this.changes 
        });
    });
});

// 2. Clear ALL history from the database
app.delete('/api/history', (req, res) => {
    const sql = `DELETE FROM messages`;

    db.run(sql, [], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ 
            message: "All history cleared", 
            deletedCount: this.changes 
        });
    });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));