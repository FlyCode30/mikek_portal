# Hospital Triage App Database Schema

## Preface

This project originally ran as a full stack application using a Node.js/Express server and a MySQL database. For the portfolio version hosted on GitHub Pages, the backend has been removed and the application is powered by static JSON data instead. The schema below represents the original database design. It is my intention to gradually shift this back to using a database, but for now, this was left to explain the original design choices made.

Also, it should be noted that this was done as a school project with specific scope. For that reason, certain functions of the app were combined into 1 UI, although future iterations will attempt to separate functions so it more closely resembles something that used in real life (for example, a database that contains medical information wouldn't also serve as an entity to store the login information for a specific app).

## 1. Entities Description

### 1.1 Patient (Dimension Table)

Stores information about patients for reference purposes.

**Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| pt_id | INT | (PK) Hospital patient ID |
| last_name | VARCHAR | Patient last name |
| first_name | VARCHAR | Patient first name |
| tri_id | INT | the current triage status of the patient |
| diagnosis | VARCHAR | most likely diagnosis |
| pt_login_name | VARCHAR | login name for patient portal |
| pt_password | VARCHAR || patient password for patient portal |

---

### 1.2 Triage (Dimension Table)

Stores triage information.

**Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| tri_id | INT (PK) | Triage level (1–5) |
| tri_name | VARCHAR | Description (e.g., "Resuscitation – Non-Urgent") |
| tri_benchmark | INT | a benchmark for wait times set by the province |

**Note on EstimatedWaitTime:** Can be calculated using historical averages for similar triage levels or dynamically based on patient load.

---

### 1.5 Fact Table: Flow Tracker

Tracks patient events and movements through the hospital over time.

**Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| track_id | INT (PK) | Surrogate key for a given movement or incident |
| pt_id | INT (FK) | References patient.pt_id |
| tri_id | INT (FK) | References triage.tri_id |
| timeDate | YYYY-MM-DD HH:MM:SS | indicates the time the event occured |
| move_status | VARCHAR | indicates whether the movement is complete or pending |

---

### 1.6 UI Table (Materialized/Virtual)

Represents what the user sees in the app dashboard, combining data from dimension and fact tables.

**Attributes:**

| Attribute | Type | Description |
|-----------|------|-------------|
| PatientID | INT | Hospital patient ID |
| PatientName | VARCHAR | FirstName + LastName concatenated |
| TriageStatus | VARCHAR | Current triage level |
| Wait Status | VARCHAR | indicates the current status of the patient for a given movement
| Diagnosis | VARCHAR | Current diagnosis |
| Current Wait | INT | indicates the number of minutes the patient has been waiting to see a doctor |

---

## 2. Relationships
```
Patient ↔ Flow Tracker
  One-to-many (each patient can have multiple moves/events)

Doctor ↔ Flow Tracker
  One-to-many (each doctor may handle multiple events)

Location ↔ Flow Tracker
  One-to-many (each location can host multiple patient moves)

Triage ↔ Patient
  One-to-many (each patient assigned a triage level)

Flow Tracker ↔ Intervention
  Optional one-to-many (if interventions are tracked as separate records)
```

---

## 3. Notes on Estimated Wait Time

Estimated wait time can be calculated dynamically based on:

- **Historical average wait times** per triage level
- **Priority rules** Orders tracker table by triage level and then time triaged. Ensures higher priority goes to higher triage status first, and then by order of triaged.
- **Calculations** Once the list is prioritized, an estimated wait time is calculated by subtracting their benchmark wait time from the time they have been waiting. A running tally is then created from this estimated wait time to come up with each patients estimated wait time (the own patients wait time must also be subtracted since a running tally includes their own. Once everyone ahead of a given patient has been seen, they would not keep waiting, thus their own wait time is not included).
- **Current load** In the real world, it could be possible to calculate a wait time based on available staff, but for the purposes of this projec, that was not taken into consideration.

- This value is then retrieved by simply requesting est_wait_time from the given for a given patient. 

---

## 4. Star Schema Design Rationale

This database follows a **star schema** pattern with:

- **Dimension tables** holding entity attributes (Patient, Doctor, Location, Triage)
- **Fact table** (Flow Tracker) recording events through time

**Benefits:**
- Dimension tables capture current state
- Fact table maintains historical timeline
- Enables analysis of wait times, patient flow, and resource utilization
- UI queries combine current state (dimensions) with historical data (facts)

<img src="docs/triage_app_db_model.png" alt="ERD of Hospital Triage App" width="600">
