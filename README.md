# 🌊 BanjirSense
## AI-Powered Flood Prediction, Survival Guidance & National Response Coordination System

> Not just preventive — but responsive and actionable.

---

## 🚨 Problem Statement

Flooding remains one of the most frequent and damaging disasters in Malaysia.

Existing systems provide:
- Rainfall data  
- River water levels  
- Victim statistics  
- Weather forecasts  

However, they do **not**:
- Predict localized flood risk clearly for individuals  
- Provide personalized preparation guidance  
- Enable real-time citizen-to-authority coordination  
- Validate emergency severity using AI  
- Support structured rescue prioritization  

Flood apps today are **reactive**.  
BanjirSense is designed to be **predictive, guided, and coordinated**.

---

## 💡 Solution Overview

BanjirSense is an AI-powered disaster management system that supports users across the full flood lifecycle:

### 1️⃣ Before Flood — Predict & Prepare
- Location-aware flood risk scoring  
- Official JPS (Public InfoBanjir) integration  
- AI-generated personalized preparation checklist  

### 2️⃣ During Flood — Stranded Mode (SOS)
- One-tap emergency activation  
- Real-time location sharing  
- AI severity analysis  
- Live rescue status tracking  

### 3️⃣ After Rescue — Recovery Flow
- Arrival confirmation  
- Emergency record summary  
- Recovery mode guidance  

---

## 🧠 AI & Google Technology Stack

BanjirSense uses meaningful AI integration across multiple layers:

### 🔹 Flood Risk Scoring 
- Heuristic flood risk model (active fallback)
- Vertex AI–ready architecture for ML-based prediction
- Dynamic risk scoring (LOW / MEDIUM / HIGH)
- Real-time risk computation using live JPS data

### 🔹 Gemini AI (Generative AI)
- Risk-aware preparedness guidance  
- Dynamic AI-generated safety checklist (minimum 3–4 tasks)
- Strict prompt engineering for controlled output  
- Context-aware generation (risk level + time window)

### 🔹 Vision API (Phase 2)
- Water-level estimation from uploaded images  
- Fake-report mitigation  
- AI-assisted emergency prioritization

### 🔹 Google Maps Platform
- Real-time map visualization  
- User geolocation integration  
- Flood risk zone highlighting  
- Stranded user markers  
- Nearest evacuation centre detection  
- Distance-based routing logic

### 🔹 Firebase
- Firebase Authentication (Google + Email)  
- Firebase Admin token verification  
- Cloud Firestore (real-time sync)  
- Per-user profile + dependents storage  

---

## 🔹 Government Data Integration

BanjirSense integrates official Malaysian disaster and flood data to ensure accurate, real-time situational awareness.

#### Public InfoBanjir (JPS)
- Real-time rainfall monitoring
- River water level data
- Flood severity status normalization  
  (`Normal` / `Alert` / `Warning` / `Danger`)
- Distance-based nearest station detection
- Cached backend integration for stability and reliability

#### JKM InfoBencana (Pusat Pemindahan Sementara – PPS)
- Live evacuation centre (PPS) locations
- Shelter capacity percentage (% full)
- Number of evacuees (`mangsa`) and families (`keluarga`)
- Active disaster type (`Banjir`, `Kebakaran`, etc.)
- Map-ready geolocation data for navigation and routing

---

## 🏗️ System Architecture

### Frontend
- Vite + React + TypeScript  
- State-based screen flow  
- Location-aware risk detection  
- AI-driven UI rendering  

### Backend
- Node.js + Express  
- Modular API structure:
  - `/auth`
  - `/users`
  - `/dependents`
  - `/gov/jps`
  - `/prediction`
  - `/sos`
  - `/map`
- Secure Firebase Admin token verification  
- Heuristic + Vertex AI fallback logic  

### Real-Time Flow
Weather + Location
        ↓
JPS Official Data
        ↓
Risk Scoring Model
        ↓
Gemini AI Guidance
        ↓
User SOS / Reports
        ↓
Firebase Real-Time Sync
        ↓
Live Map + Rescue Coordination


---

## 🔐 Security Architecture

- Firebase ID Token authentication  
- Backend verification using Firebase Admin  
- Authorization header injection via API layer  
- User data stored under authenticated UID  
- Structured Firestore subcollections:
  - `users/{uid}`
  - `users/{uid}/dependents`

---

## 👤 User Features

### ✅ Implemented
- Register / Login (Google & Email)
- Password reset
- User profile management
- Emergency medical profile
- Dependents CRUD (Firestore-synced)
- Location-aware flood prediction
- Nearby official JPS station detection
- AI-generated preparedness checklist
- Shelter map with capacity visualization
- SOS emergency activation flow
- Real-time emergency status screen
- Arrival confirmation interface
- Clean error handling & fallbacks

---

## 📍 Nearby JPS Integration

Users can view:
- Nearest official JPS monitoring station  
- Distance from current location  
- Rainfall (1h & daily)  
- Water level (m)  
- Flood status (Normal / Alert / Warning / Danger)  

This integration increases system credibility and prevents purely AI-based assumptions.

## 🏠 Nearby PPS (JKM) Integration

Users can view:
- Nearest active evacuation centre (Pusat Pemindahan Sementara – PPS)  
- Distance from current location  
- Shelter capacity percentage (% full)  
- Number of evacuees (`mangsa`)  
- Number of families (`keluarga`)  
- Active disaster type (Banjir / Kebakaran / etc.)

This integration ensures users are directed to **official, government-verified shelters** with real operational capacity data, enabling smarter evacuation decisions and better rescue coordination.


---

## 🚨 SOS Emergency System

The SOS flow includes:
- Emergency activation  
- AI severity estimation  
- Location broadcast  
- Live team ETA tracking  
- Rescue arrival confirmation  
- Post-rescue recovery mode  

**Phase 2 Enhancement:**
- Vision API severity validation  

---

## 📊 Market Validation (Pre-Development Survey)

Before development, we conducted a survey (20 respondents) to validate problem relevance and feature priorities.

### Key Findings:
- 95% prioritized personal safety  
- 88.9% preferred personalized AI guidance over generic warnings  
- 88.9% willing to upload photos for AI verification  
- 83% would use BanjirSense if available  
- 72% strongly trust real-time location sharing with authorities  

These findings directly influenced our system architecture and feature prioritization.

---

## 🧪 User Acceptance Testing (UAT)

We conducted structured real-user testing to evaluate:
- Risk clarity  
- AI checklist usefulness  
- Nearby JPS trust impact  
- Shelter map usability  
- SOS confidence level  
- Navigation ease  

Feedback was used to:
- Improve UI clarity  
- Simplify station status labels  
- Enhance emergency flow readability  

---

## 🌍 SDG Alignment

BanjirSense aligns with:

### SDG 11 — Sustainable Cities & Communities
Improves disaster resilience through predictive guidance.

### SDG 13 — Climate Action
Supports climate adaptation using AI-based risk modeling.

### SDG 3 — Good Health & Well-Being
Enhances emergency response coordination and survival guidance.

---

## 🚀 Scalability Potential

- Vertex AI model upgrade ready  
- Vision API integration ready  
- Authority dashboard expansion  
- Multi-state rollout capability  
- Real-time coordination with:
  - NADMA  
  - BOMBA  
  - NGOs  
  - Local councils  

---

## 🏆 Why BanjirSense Is Different

| Traditional Flood Apps | BanjirSense |
|------------------------|------------|
| Monitor rainfall | Predict risk |
| Show water level | Guide preparation |
| Display statistics | Coordinate rescue |
| Generic warnings | Personalized AI checklist |
| Reactive | Predictive + Responsive |

---

## 📌 Development Status

### ✅ Completed (Preliminary Round)
- Full backend architecture  
- AI risk scoring  
- Gemini integration  
- JPS & JKM (Nearby PPS) integration  
- SOS flow UI  
- Profile + dependents  
- Real-time Firestore sync  

### 🔜 Phase 2 (Final Round Vision)
- Vision API validation  
- Authority command dashboard  
- Push notifications  
- Advanced analytics  
- ML-based risk model deployment (Vertex)

---

## 🎥 Live Demo & Presentation

🎬 **Demo Video:**  
`[Insert Video Link Here]`

📊 **Pitch Deck (Canva):**  
`[Insert Canva View-Only Link Here]`

---

## 👥 Team

### 👨‍💻 Luqman Naqiuddin bin Zulhaimi
**Role:** Team Leader & Frontend Developer 
📧 Email: luqmannaqiuddin17@gmail.com

### 👩‍💻 Siti Fatimah Binti Saniy Wong  
**Role:** Backend Developer & System Integration  
📧 Email: minsugar2203@gmail.com  
 

---

Built for **KitaHack 2026**  
AI for Disaster Management & Climate Resilience
