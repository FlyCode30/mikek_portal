// add patient
app.post("/addPatient", async (req, res) => {
  const { last_name, first_name, tri_id, diagnosis } = req.body;

  try {
    await pool.query(
      "INSERT INTO patients (last_name, first_name, tri_id, diagnosis) VALUES (?, ?, ?, ?)",
      [ last_name, first_name, tri_id, diagnosis ]
    );

    res.status(201).json({ message: "Patient added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// update patient
app.post("/updatePatient", async (req, res) => {
  const { last_name, first_name, triage_id, diagnosis, pt_id } = req.body;

  try {
    await pool.query(
      ` 
      UPDATE patients SET
        last_name = ?,
        first_name = ?,
        tri_id = ?,
        diagnosis = ?
      WHERE pt_id = ?
      `,
      [last_name, first_name, triage_id, diagnosis, pt_id]
    );

  res.status(201).json({ message: "Patient updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// delete patient. probably going to remove this. A patient would never "be deleted" from a database in health care. They're status can change, but they would never be deleted. 
// app.post("/deletePatient", async (req, res) => {
//   const { patientId } = req.body;

//   try {
//     await pool.query(
//       "DELETE FROM patient WHERE pt_id = ?",
//       [patientId]
//     );

//   res.status(201).json({ message: "Patient deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// add tracker record
app.post("/addTracker", async (req, res) => {
  const { pt_id, tri_id, tri_timeDate, move_status } = req.body;

  try {
    await pool.query(
      "INSERT INTO tracker (pt_id, tri_id, tri_timeDate, move_status) VALUES (?, ?, ?, ?)",
      [pt_id, tri_id, tri_timeDate, move_status]
    );

    res.status(201).json({ message: "Tracker record inserted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update tracker
app.post("/updateTracker", async (req, res) => {
  const { pt_id, tri_id, tri_timeDate, move_status } = req.body;

  try {
    await pool.query(
      ` 
      UPDATE tracker SET
        tri_id = ?,
        tri_timeDate = ?,
        move_status = ?
      WHERE pt_id = ?
      `,
      [pt_id, tri_id, tri_timeDate, move_statu]
    );

  res.status(201).json({ message: "Tracker updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// select patient wait time
app.get("/getPtWaitTime", async (req, res) => {
  const { pt_id } = req.body;

  try {
    const [rows] = 
    await pool.query(
     "SELECT est_wait_time FROM triage_wait_times WHERE pt_id = ?"
     [pt_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Patient not found or no wait time" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// get staff object (the data for the tracker the user sees)
app.get("/getPtList", async (req, res) => {
  const { pt_id, firstName, lastName, tri_name, diagnosis, time_waiting } = req.body;

  try {
    // have to add the const rows so it has something to return
    const [rows] = 
    await pool.query(
      `select t1.pt_id, t2.first_name, t2.last_Name, t3.tri_name, t2.diagnosis, t4.time_waiting
      from  tracker AS t1
      JOIN patients as t2
	      ON t1.pt_id = t2.pt_id
      JOIN triage as t3
        ON t1.tri_id = t3.tri_id
      JOIN triage_wait_times as t4
        ON t1.pt_id = t4.pt_id
        AND t1.tri_id = t4.tri_id;`
    );

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});