// seedPatients.js
const pool = require("../db.js");

const dropViewSql = `
  DROP VIEW IF EXISTS triage_wait_times;
`;

const sql = `
    CREATE VIEW triage_wait_times AS
    SELECT
        t.pt_id,
        t.tri_id,
        t.tri_timeDate,
        tl.tri_benchmark,
        TIMESTAMPDIFF(minute, t.tri_timeDate, NOW()) AS time_waiting,
        
        -- estimated wait time
        SUM(
           ABS(tl.tri_benchmark - TIMESTAMPDIFF(MINUTE, t.tri_timeDate, NOW()))
        ) OVER (ORDER BY t.tri_id, t.tri_timeDate)
        - ABS(tl.tri_benchmark - TIMESTAMPDIFF(MINUTE, t.tri_timeDate, NOW()))
        AS est_wait_time

    from tracker t
    JOIN triage tl
        ON t.tri_id = tl.tri_id
    WHERE t.move_status = "pending";                       
`;

async function run() {
  try {
    await pool.query(sql);
    console.log("Created wait time view!");
  } catch (err) {
    console.error("Failed to create wait time view:", err.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();

/** 
 * secondary create view expression. They both essentially do the same thing, the difference is that the one above will set the time waiting as now, while the one before can be set for anything.
 * If you want to change the current time to something custom, then change the date or time after CAST(. 
 * This will matter because if you use time now, but the triage times are for a week ago, their wait times will be enourmous. 
 * 
 * Either way, both work the same way. The estimated wait time is calculated by subtracting the time they were triaged from now (or reference_time) to get the waiting time.
 * The expression then creates an attribute that creates substracts their actual wait time from their benchmark wait time to estimate how long they have to wait. 
 * It then creates a running tally of those wait times, based on triage level and time they were triaged, and then subtracts a person's own time to arrive at an estimated wait time. 
 * */ 

//  DROP VIEW if EXISTS triage_wait_times;
 
// CREATE VIEW triage_wait_times AS
// SELECT
// 	t.pt_id,
// 	t.tri_id,
// 	t.tri_timeDate,
// 	tl.tri_benchmark,
// 	TIMESTAMPDIFF(minute, t.tri_timeDate, t.reference_time) AS time_waiting,
	
// 	-- estimated wait time
// 	SUM(
// 	   ABS(tl.tri_benchmark - TIMESTAMPDIFF(MINUTE, t.tri_timeDate, t.reference_time))
// 	) OVER (ORDER BY t.tri_id, t.tri_timeDate)
// 	- ABS(tl.tri_benchmark - TIMESTAMPDIFF(MINUTE, t.tri_timeDate, t.reference_time))
// 	AS est_wait_time
	
// 	from (
// 		SELECT
// 			tr.*,
// 			CAST('2025-11-27 17:00:00' AS DATETIME) AS reference_time
// 		from tracker tr
// 		) t
// JOIN triage tl
// 	ON t.tri_id = tl.tri_id
// WHERE t.move_status = "pending";