// seedPatients.js
const pool = require("../db");

const sql = `
INSERT INTO patients (pt_id, first_name, last_name, tri_id, diagnosis) VALUES
  (10001, 'Ethan', 'McKay', 1, 'Cardiac arrest, CPR in progress'),
  (10002, 'Sarah', 'Lavoie', 1, 'Severe polytrauma from MVC'),

  (10003, 'Michael', 'Chen', 2, 'Acute stroke symptoms, facial droop'),
  (10004, 'Aisha', 'Patel', 2, 'Suspected sepsis with high fever'),
  (10005, 'Liam', 'Connor', 2, 'Chest pain radiating to left arm'),
  (10006, 'Nicole', 'Girard', 2, 'Severe asthma exacerbation'),

  (10007, 'Jason', 'Brooks', 3, 'Moderate abdominal pain, vomiting'),
  (10008, 'Emily', 'Nguyen', 3, 'Migraine with photophobia'),
  (10009, 'Harper', 'Singh', 3, 'Fractured wrist with swelling'),
  (10010, 'Jacob', 'Gauthier', 3, 'Moderate dehydration'),
  (10011, 'Sophie', 'Bouchard', 3, 'Pneumonia symptoms, productive cough'),
  (10012, 'Oliver', 'Martins', 3, 'Complex laceration needing sutures'),
  (10013, 'Ava', 'Robertson', 3, 'Renal colic, flank pain'),

  (10014, 'Noah', 'Bennett', 4, 'Sprained ankle, mild swelling'),
  (10015, 'Grace', 'Henderson', 4, 'Sore throat, possible strep'),
  (10016, 'Caleb', 'Fraser', 4, 'Mild abdominal discomfort'),
  (10017, 'Mia', 'Fortin', 4, 'Ear infection, mild fever'),
  (10018, 'Evan', 'Lambert', 4, 'Minor back pain'),
  (10019, 'Layla', 'Fong', 4, 'Mild asthma symptoms'),
  (10020, 'Henry', 'Cormier', 4, 'Chronic knee pain flare-up'),
  (10021, 'Chloe', 'Thompson', 4, 'Urinary tract infection'),
  (10022, 'Logan', 'Desjardins', 4, 'Nasal congestion, sinusitis'),
  (10023, 'Aria', 'Roy', 4, 'Skin rash, possible allergic reaction'),
  (10024, 'Daniel', 'Morrison', 4, 'Minor laceration to forearm'),
  (10025, 'Ella', 'Bates', 4, 'Mild concussion symptoms'),
  (10026, 'Wyatt', 'Sharpe', 4, 'Dental pain, cavity'),
  (10027, 'Zoey', 'Arsenault', 4, 'Vomiting without dehydration'),
  (10028, 'Nathan', 'Beaulieu', 4, 'Pink eye'),
  (10029, 'Lily', 'McIntyre', 4, 'Mild foot sprain'),
  (10030, 'Benjamin', 'Keller', 4, 'Localized hand swelling'),

  (10031, 'Riley', 'Cameron', 5, 'Medication refill request'),
  (10032, 'Hannah', 'Porter', 5, 'Mild cold symptoms'),
  (10033, 'Aiden', 'Miller', 5, 'Chronic shoulder soreness'),
  (10034, 'Zara', 'Wallace', 5, 'Minor skin irritation'),
  (10035, 'Carter', 'Jones', 5, 'Mild headache'),
  (10036, 'Penelope', 'Clark', 5, 'Routine bloodwork request'),
  (10037, 'Dylan', 'Stewart', 5, 'Request for pregnancy test'),
  (10038, 'Violet', 'Duncan', 5, 'Minor toe bruise'),
  (10039, 'Ryan', 'Simpson', 5, 'Old injury check-up'),
  (10040, 'Camila', 'Perrault', 5, 'Seasonal allergies'),
  (10041, 'Xavier', 'Toye', 5, 'Mild diarrhea, no dehydration'),
  (10042, 'Nora', 'White', 5, 'Wound check, no infection'),
  (10043, 'Mason', 'Hardy', 5, 'Requesting work note'),
  (10044, 'Aurora', 'Grant', 5, 'Mild muscle strain'),
  (10045, 'Sebastian', 'Cote', 5, 'Blood pressure recheck'),
  (10046, 'Hailey', 'Turner', 5, 'Minor insect bite'),
  (10047, 'Leo', 'MacDonald', 5, 'Vaccination request'),
  (10048, 'Stella', 'Moffat', 5, 'Rash follow-up'),
  (10049, 'Mateo', 'Sinclair', 5, 'Mild tension headache'),
  (10050, 'Isla', 'Rowe', 5, 'Vision test request');
`;

async function run() {
  try {
    await pool.query(sql);
    console.log("Seeded 50 patients!");
  } catch (err) {
    console.error("Failed to seed patients:", err.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();
