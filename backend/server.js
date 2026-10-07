const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

const db = mysql.createPool({
    host: 'localhost',
    user: 'student',
    password: 'student123',
    database: 'research_portal',
    dateStrings: true

});

const FIELDS = ['title', 'description', 'research_area', 'faculty_name', 'department',
    'required_skills', 'available_positions', 'application_deadline', 'status'
]


function isValid(d) {
    const text = FIELDS.slice(0, 6).every(f => typeof d[f] === 'string' && d[f].trim());
    const pos = Number.isInteger(Number(d.available_positions)) && Number(d.available_positions) >= 0
        && d.available_positions !== '' && d.available_positions != null;
    const date = !isNaN(new Date(d.application_deadline));
    const status = ['Open', 'Closed'].includes(d.status);
    return text && pos && date && status;
}

// CREATE
app.post('/api/opportunities', async (req, res) => {
    try {
        const d = { status: 'Open', ...req.body };
        if (!isValid(d)) return res.status(400).json({ error: 'Invalid or missing data' });
        const [r] = await db.query(
            `INSERT INTO opportunities (${FIELDS.join(',')}) VALUES (?,?,?,?,?,?,?,?,?)`,
            FIELDS.map(f => d[f]));
        const [rows] = await db.query('SELECT * FROM opportunities WHERE id=?', [r.insertId]);
        res.status(201).json(rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// READ ALL
app.get('/api/opportunities', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM opportunities');
        res.status(200).json(rows);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// READ ONE
app.get('/api/opportunities/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM opportunities WHERE id=?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// UPDATE
app.put('/api/opportunities/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM opportunities WHERE id=?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        const d = { ...rows[0], ...req.body };
        if (!isValid(d)) return res.status(400).json({ error: 'Invalid or missing data' });
        await db.query(
            `UPDATE opportunities SET ${FIELDS.map(f => f + '=?').join(',')} WHERE id=?`,
            [...FIELDS.map(f => d[f]), req.params.id]);
        const [updated] = await db.query('SELECT * FROM opportunities WHERE id=?', [req.params.id]);
        res.status(200).json(updated[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// DELETE
app.delete('/api/opportunities/:id', async (req, res) => {
    try {
        const [r] = await db.query('DELETE FROM opportunities WHERE id=?', [req.params.id]);
        if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
        res.status(200).json({ message: 'Deleted' });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.listen(3000, () => console.log('Server running on port 3000'));