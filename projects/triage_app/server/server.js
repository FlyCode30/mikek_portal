const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const pool = require("./db"); 

const app = express();
const PORT = 3000;

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
console.log('Serving static from:', PUBLIC_DIR);

app.use(express.static(PUBLIC_DIR));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Add Patient (also creates a tracker entry)
app.post('/api/triage/addPatient', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { last_name, first_name, tri_id, tri_timeDate, diagnosis } = req.body;

    // Insert into patients
    const [result] = await conn.query(
      'INSERT INTO patients (last_name, first_name, tri_id, diagnosis) VALUES (?, ?, ?, ?)',
      [last_name, first_name, tri_id, diagnosis]
    );

    const pt_id = result.insertId;

    // Insert into tracker with pending status and current timestamp
    await conn.query(
      'INSERT INTO tracker (pt_id, tri_id, tri_timeDate, move_status) VALUES (?, ?, ?, "pending")',
      [pt_id, tri_id, tri_timeDate]
    );

    await conn.commit();
    res.json({ success: true, pt_id });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    conn.release();
  }
});

// Update Patient Dimension
console.log("Registering POST /api/triage/updatePatientDim");
app.post('/api/triage/updatePatientDim', async (req, res) => {
  console.log("Hit /api/triage/updatePatientDim with body:", req.body);
  try {
    const { pt_id, last_name, first_name, tri_id, diagnosis } = req.body;
    await pool.query(
      'UPDATE patients SET last_name=?, first_name=?, tri_id=?, diagnosis=? WHERE pt_id=?',
      [last_name, first_name, tri_id, diagnosis, pt_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 *  Add patient tracker
 * */ 
app.post('/api/triage/addPatientTracker', async (req, res) => {
  try {
    const { pt_id, tri_id, tri_timeDate, move_status } = req.body;
    await pool.query(
      'INSERT INTO tracker (pt_id, tri_id, tri_timeDate, move_status) VALUES (?, ?, ?, ?)',
      [pt_id, tri_id, tri_timeDate, move_status]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 *  Gets Patient List that includes wait times and most recent changes from the tracker
 * */ 
app.get('/api/triage/getPtList', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t1.pt_id, t2.last_name, t2.first_name, t1.tri_id, t1. move_status, t2.diagnosis, t4.time_waiting
      FROM tracker AS t1
      JOIN (
        SELECT pt_id, 
        MAX(tri_timeDate) AS latest_tri_time 
        FROM tracker 
        GROUP BY pt_id) AS latest 
        ON t1.pt_id = latest.pt_id
        AND t1.tri_timeDate = latest.latest_tri_time
      LEFT JOIN patients AS t2 ON t1.pt_id = t2.pt_id
      LEFT JOIN triage_wait_times AS t4 ON t1.pt_id = t4.pt_id AND t1.tri_id = t4.tri_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});





