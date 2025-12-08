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

project-root/
├─ public/                # UI static files
│  ├─ index.html
│  └─ styles.css
├─ server/                # Backend code
│  ├─ server.js
│  ├─ routes/
│  └─ db/
├─ mock-data/
│  └─ patients.json
└─ README.md
