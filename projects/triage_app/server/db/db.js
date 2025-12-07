// import mysql from "mysql2/promise";   // if using ES modules
const mysql = require("mysql2/promise");

// create one pool for the app
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1aL=djmy#W$M",
  database: "hospital_triage"
});

// Optional: quick connection test (but do NOT close the pool)
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL pool connected!");
    conn.release(); // give it back to the pool
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
})();

// export default conn;
module.exports = pool;