# 🏥 Hospital Triage Management App

## 📌 Overview

This project is a web-based application designed to simulate a hospital triage system. This project was originally developed as a school assignment with a defined scope and requirements. The current version meets those initial objectives, but future improvements and expansions are planned to turn it into a more fully featured application with features that more closely resemble a real life patient flow.

This repository contains **two versions of the project**:

| Version | Description |
|--------|-------------|
| **Static Demo Version (GitHub Pages)** | Uses JSON as a data source for UI demonstration — no backend required |
| **Full Backend Version (Local Only)** | Node.js + Express server with MySQL database for full CRUD functionality |

---

## 🌐 Live Demo  
*(Static JSON version — UI only)*  
🔗 https://flycode30.github.io/mikek_portal/portfolio-info.html?p=triage_app

---

## 💻 Tech Stack

**Frontend**
- HTML / CSS / JavaScript
- Bootstrap / Vanilla UI components
- Fetch API for loading JSON data

**Backend (Full Version)**
- Node.js + Express
- MySQL as primary database
- REST API endpoints for data interaction

---

## ⭐ Features

### Static Demo (Portfolio Version)
- Displays patient triage list and wait-time metrics
- Reads patient data from JSON (simulated DB output)
- Responsive UI for browsing triage queue that includes dynmaic and search features

### Full Backend Version
- Add/Update/View patients (CRUD)
- REST API endpoints using Express
- Real queries against relational schema
- Wait time calculations via SQL logic

---

## 🗂 Project Structure

```txt
project-root/
├─ public/                # UI static files
│  ├─ css
|  ├─ docs
|  ├─ img
|  ├─ js
|  ├─ json
|  ├─ scss
|  ├─ vendor
|  ├─ db.md
|  ├─ index.html
|  ├─ login.html
│  └─ pt_dashboard.html
├─ server/
|  ├─ db
|  |  ├─ seed_queries       # queries to populate tables
|  |  ├─ createSchema.js    # creates schema for db
|  |  ├─ createTables.js    # creates tables for db
|  |  ├─ createView.js      # creates view for db. Used to do calculated columns
|  |  └─ db.js              # sets up db connection to MySql
│  └─ server.js
├─ extra
├─ .vscode                  # contains extra code from the original bootstrap template
└─ README.md
```

## 🧠 System Architecture

Frontend (UI) → fetch() → API routes → Models → MySQL Database

In the static deployment, this chain is simulated using JSON.

---

## 🗃 Database Design (Full Version)

> This app was originally built with a MySQL relational schema.  
> The live demo uses JSON output exported from the same queries.

📄 [Database README](docs/triage_app/database_README.md)  
📊 ERD: `docs/triage_app_db_model.png`

---

## 🚀 Running the Full Backend Version Locally

📌 Future Improvements

* Deploy backend to cloud + connect UI live
* Role-based access (nurse/doctor/admin)
* Separate triage assessment functionality from pure tracker functioality
