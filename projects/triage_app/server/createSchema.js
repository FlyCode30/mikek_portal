const mysql = require("mysql2/promise");

async function run() {
  try {
    const pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "1aL=djmy#W$M",
    });

    await pool.query("CREATE DATABASE IF NOT EXISTS hospital_triage;");
    console.log("Database created!");

    await pool.end();   // close pool
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    process.exit(0); // exit script
  }
}

run();