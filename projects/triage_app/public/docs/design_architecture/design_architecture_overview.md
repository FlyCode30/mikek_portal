# 🏥 Systems Architecture Overview

--- 

## Users

1. Staff
2. Patients

---

## Layers

### Application Layer

- browser

### Presentation

- HTML / CSS / JavaScript
- Bootstrap / Vanilla UI components

### Data Layer

**Portal Version**

- read-only static data

**Full-version**

- Node.js + Express
- MySQL as primary database

---

## Data Flow

**Portal Version**

- Data is simulated via JSON files.

**Full-version**

- Frontend (UI) → fetch() → API routes → Models → MySQL Database