// seedPatients.js
const pool = require("../db");

const sql = `
INSERT INTO triage (tri_id, tri_name, tri_benchmark) VALUES
    ('1', 'resuscitation', 0),
    ('2', 'emergency', 15),
    ('3', 'urgent', 30),
    ('4', 'less urgent', 60),
    ('5', 'non urgent', 120)
`;

async function run() {
  try {
    await pool.query(sql);
    console.log("Seeded triage table");
  } catch (err) {
    console.error("Failed to seed triage: ", err.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();