// createTables.js
const pool = require("./db");   // uses the same pool config as server.js

async function run() {
  try {
    // 1) patients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        pt_id INT AUTO_INCREMENT PRIMARY KEY,
        last_name VARCHAR(50),
        first_name VARCHAR(50),
        tri_id INT,
        diagnosis VARCHAR(255),
        pt_login_name VARCHAR(20),
        pt_password VARCHAR(20)
      )
    `);

    // 2) triage table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS triage (
        tri_id INT PRIMARY KEY,          -- 1–5 levels
        tri_name VARCHAR(100),
        tri_benchmark INT
      )
    `);

    // 3) tracker fact table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tracker (
        track_id INT AUTO_INCREMENT PRIMARY KEY,
        pt_id INT,
        tri_id INT,
        tri_timeDate DATETIME,
        move_status VARCHAR(20),
        FOREIGN KEY (pt_id) REFERENCES patients(pt_id),
        FOREIGN KEY (tri_id) REFERENCES triage(tri_id)
      )
    `);

    console.log("All tables created!");
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await pool.end();   // close this script's pool
    process.exit(0);
  }
}

run();
