const pool = require("./db");

const sql = `
INSERT INTO patients (pt_id, last_name, first_name, tri_id, diagnosis) VALUES
  (66666, 'Ethan', 'McKay', 1, 'Cardiac arrest, CPR in progress')
  `;

async function run() {
  try {
    await pool.query(sql);
    console.log("Seeded test patient");
  } catch (err) {
    console.error("Failed to seed patients:", err.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();
