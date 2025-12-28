use hospital_triage;

-- testing js code

         SELECT t1.pt_id, t2.first_name, t2.last_name, t3.tri_name, t2.diagnosis, t4.time_waiting, t4.est_wait_time, t1.move_status, t1.tri_id
      FROM tracker AS t1
      LEFT JOIN patients AS t2 ON t1.pt_id = t2.pt_id
      LEFT JOIN triage AS t3 ON t1.tri_id = t3.tri_id
      LEFT JOIN triage_wait_times AS t4 ON t1.pt_id = t4.pt_id AND t1.tri_id = t4.tri_id;

-- frequently used scipt to test sql commands on hospital_triage

select * 
from tracker
ORDER BY pt_id;

select *
from patients;

DELETE FROM patients
where pt_id IN (10058, 10059, 10060, 10061, 10062);

DELETE FROM tracker
WHERE pt_id IN (10062);

-- clears tract table if you want to reset data
TRUNCATE TABLE tracker;

select * 
from triage_wait_times;
    
-- testing sql scripts for route methods

-- for selecting data from view to be used for staff table

-- actual expressions used
select t1.pt_id, t2.first_name, t2.last_Name, t3.tri_name, t2.diagnosis, t4.time_waiting
from  tracker AS t1
JOIN patients as t2
	ON t1.pt_id = t2.pt_id
JOIN triage as t3
	ON t1.tri_id = t3.tri_id
JOIN triage_wait_times as t4
	ON t1.pt_id = t4.pt_id
    AND t1.tri_id = t4.tri_id;
    
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
LEFT JOIN triage_wait_times AS t4 ON t1.pt_id = t4.pt_id AND t1.tri_id = t4.tri_id;


-- this create view expression uses the current time to estimate waiting time for patients
 DROP VIEW if EXISTS triage_wait_times;

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
  WHERE 
    t.move_status = "pending"
    AND t.tri_timeDate = (
    SELECT MAX(t2.tri_timeDate)
      FROM tracker t2
      WHERE t2.pt_id = t.pt_id
      AND t2.move_status = 'pending'
    );                   
    
-- this create view expression uses a custom time as the reference point for calculating estimated time waiting

 DROP VIEW if EXISTS triage_wait_times;
 
CREATE VIEW triage_wait_times2 AS
SELECT
	t.pt_id,
	t.tri_id,
	t.tri_timeDate,
	tl.tri_benchmark,
	TIMESTAMPDIFF(minute, t.tri_timeDate, t.reference_time) AS time_waiting,
	
	-- estimated wait time
	SUM(
	   ABS(tl.tri_benchmark - TIMESTAMPDIFF(MINUTE, t.tri_timeDate, t.reference_time))
	) OVER (ORDER BY t.tri_id, t.tri_timeDate)
	- ABS(tl.tri_benchmark - TIMESTAMPDIFF(MINUTE, t.tri_timeDate, t.reference_time))
	AS est_wait_time
	
	from (
		SELECT
			tr.*,
			CAST('2025-11-27 17:00:00' AS DATETIME) AS reference_time
		from tracker tr
		) t
JOIN triage tl
	ON t.tri_id = tl.tri_id
WHERE 
t.move_status = "pending"
AND t.tri_timeDate = (
SELECT MAX(t2.tri_timeDate)
  FROM tracker t2
  WHERE t2.pt_id = t.pt_id
  AND t2.move_status = 'pending'
);      

-- the following script all involves inserting records into hospital_triage outside of js code. 
-- meant to sets up pre set data

rename table triage_wait_times2 to triage_wait_times;

INSERT INTO patients (pt_id, first_name, last_name, tri_id, diagnosis) VALUES
  -- CTAS 1 (Resuscitation) - 3 patients
  (10051, 'Noah',   'King',        1, 'Severe head trauma, unresponsive'),
  (10052, 'Julia',  'Olsen',       1, 'Acute respiratory failure, severe distress'),
  (10053, 'Marcus', 'Ibrahim',     1, 'Profuse external bleeding from leg injury'),

  -- CTAS 2 (Emergent) - 4 patients
  (10054, 'Sienna', 'Dubois',      2, 'Acute coronary syndrome, crushing chest pain'),
  (10055, 'Owen',   'Silva',       2, 'Possible meningitis, fever and neck stiffness'),
  (10056, 'Layne',  'Harrison',    2, 'Severe shortness of breath with wheezing'),
  (10057, 'Clara',  'Kowalski',    2, 'High fever with low blood pressure, suspected sepsis'),

  -- CTAS 3 (Urgent) - 9 patients
  (10058, 'Milo',   'Reid',        3, 'Moderate asthma exacerbation, speaking in phrases'),
  (10059, 'Bella',  'Marchand',    3, 'Uncontrolled vomiting with mild dehydration'),
  (10060, 'Elias',  'Romero',      3, 'Suspected appendicitis, right lower quadrant pain'),
  (10061, 'Tara',   'Jensen',      3, 'Complex hand laceration needing sutures'),
  (10062, 'Jonah',  'Barlow',      3, 'Moderate head injury, brief loss of consciousness'),
  (10063, 'Paige',  'Fischer',     3, 'Painful kidney stone, severe flank pain'),
  (10064, 'Declan', 'Hughes',      3, 'Shortness of breath on exertion, abnormal vitals'),
  (10065, 'Renee',  'Carson',      3, 'Pneumonia with shortness of breath and fever'),
  (10066, 'Harvey', 'Ng',          3, 'Uncontrolled high blood pressure with headache'),

  -- CTAS 4 (Less Urgent) - 14 patients
  (10067, 'Naomi',   'Peters',     4, 'Mild abdominal pain, stable vitals'),
  (10068, 'Logan',   'Franco',     4, 'Sprained wrist after fall'),
  (10069, 'Ivy',     'Santos',     4, 'Ear pain, suspected otitis media'),
  (10070, 'Griffin', 'Young',      4, 'Chronic back pain flare up'),
  (10071, 'Mira',    'Allan',      4, 'Mild asthma symptoms, no distress'),
  (10072, 'Colin',   'Walsh',      4, 'Minor facial laceration, bleeding controlled'),
  (10073, 'Elise',   'Hart',       4, 'Painful urinary tract infection'),
  (10074, 'Rafael',  'Costa',      4, 'Ankle sprain with swelling'),
  (10075, 'Anika',   'Khan',       4, 'Suspected mild cellulitis, leg redness'),
  (10076, 'Caleb',   'Morin',      4, 'Mild dehydration, tolerating fluids'),
  (10077, 'Iris',    'Gallagher',  4, 'Moderate dental pain, no swelling'),
  (10078, 'Tristan', 'Page',       4, 'Sore throat and low grade fever'),
  (10079, 'Jade',    'Liang',      4, 'Mild concussion symptoms after sports injury'),
  (10080, 'Felix',   'Barker',     4, 'Hand contusion after workplace incident'),

  -- CTAS 5 (Non-Urgent) - 20 patients
  (10081, 'Summer',  'Lam',        5, 'Chronic knee pain, follow up'),
  (10082, 'Henry',   'Nolan',      5, 'Medication refill for blood pressure'),
  (10083, 'Ariana',  'Bell',       5, 'Mild seasonal allergy symptoms'),
  (10084, 'Jared',   'Cook',       5, 'Rash on arm, no systemic symptoms'),
  (10085, 'Keira',   'Doyle',      5, 'Mild headache, no red flags'),
  (10086, 'Damon',   'Shaw',       5, 'Old ankle injury check'),
  (10087, 'Lena',    'Vargas',     5, 'Request for pregnancy test, no pain'),
  (10088, 'Rowan',   'Patel',      5, 'Chronic shoulder soreness, not worsening'),
  (10089, 'Molly',   'Greer',      5, 'Mild cold symptoms and cough'),
  (10090, 'Tyler',   'Hoffman',    5, 'Work note request after minor illness'),
  (10091, 'Zoe',     'Richards',   5, 'Suture removal follow up'),
  (10092, 'Simon',   'Yu',         5, 'Blood pressure recheck, asymptomatic'),
  (10093, 'Nadia',   'Gomez',      5, 'Minor skin irritation on hands'),
  (10094, 'Quinn',   'Bishop',     5, 'Mild eye redness, likely irritation'),
  (10095, 'Isabel',  'Cummings',   5, 'Routine lab work request'),
  (10096, 'Reid',    'Armstrong',  5, 'Ear wax buildup, no pain'),
  (10097, 'Chantal', 'Roy',        5, 'Mild toe pain after stubbed toe'),
  (10098, 'Brady',   'Laurent',    5, 'Chronic mild headache, follow up'),
  (10099, 'Elsa',    'Mitchell',   5, 'Request for vaccination'),
  (10100, 'Gavin',   'Sears',      5, 'Minor insect bite, no swelling');

-- for tweaking complete and pending status

UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10001;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10002;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10003;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10004;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10005;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10006;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10007;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10008;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10009;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10010;

UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10011;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10012;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10013;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10014;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10015;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10016;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10017;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10018;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10019;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10020;

UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10021;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10022;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10023;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10024;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10025;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10026;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10027;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10028;
UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10029;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10030;

UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10031;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10032;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10033;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10034;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10035;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10036;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10037;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10038;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10039;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10040;

UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10041;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10042;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10043;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10044;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10045;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10046;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10047;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10048;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10049;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10050;

UPDATE tracker SET move_status = 'complete' WHERE pt_id = 10051;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10052;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10053;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10054;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10055;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10056;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10057;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10058;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10059;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10060;

UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10061;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10062;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10063;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10064;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10065;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10066;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10067;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10068;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10069;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10070;

UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10071;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10072;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10073;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10074;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10075;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10076;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10077;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10078;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10079;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10080;

UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10081;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10082;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10083;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10084;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10085;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10086;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10087;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10088;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10089;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10090;

UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10091;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10092;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10093;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10094;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10095;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10096;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10097;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10098;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10099;
UPDATE tracker SET move_status = 'pending' WHERE pt_id = 10100;
