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
- Vertex AI–ready architecture for ML-based prediction (Phase 2)
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
- Per-user profile + dependents storage (Data is stored per authenticated user UID)

---

## 🧠 AI Justification & Design Rationale

### 🔹 Gemini AI Justification

Gemini was chosen to generate structured, risk-aware survival guidance dynamically, enabling personalized decision support instead of static informational alerts.  
Instead of displaying generic flood warnings, Gemini produces concise, actionable preparation steps tailored to the user’s real-time risk level and context.  
This improves clarity, reduces decision delay, and enhances emergency readiness.

---

### 🔹 Vertex AI Justification

The Vertex AI-ready architecture enables scalable, machine learning-based flood prediction.  
While the current system uses a heuristic fallback model, the backend is structured to seamlessly integrate a trained Vertex AI model for advanced predictive analytics.  
This design ensures future deployment of data-driven flood forecasting without requiring architectural redesign, supporting long-term scalability and government-level integration.

---

### 🔹 Vision API Justification (Phase 2)

The Google Cloud Vision API is planned for AI-assisted severity validation during emergency reporting.  
When users upload images in Stranded Mode, Vision will:

- Detect water level presence and coverage
- Estimate environmental severity indicators
- Reduce false or misleading distress reports
- Assist in rescue prioritization logic

This ensures ethical and responsible AI usage by validating emergency conditions before resource allocation, improving accuracy and operational efficiency in disaster response coordination.

---

## 🧑‍💼 Government Data Integration

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
Weather + Location <br>
        ↓ <br>
JPS Official Data <br>
        ↓ <br>
Risk Scoring Model <br>
        ↓ <br>
Gemini AI Guidance <br>
        ↓ <br>
User SOS / Reports <br>
        ↓ <br>
Firebase Real-Time Sync <br>
        ↓ <br>
Live Map + Rescue Coordination <br>


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
## 🛠️ Technical Challenges & Engineering Decisions

### 🔹 Challenge 1: Incomplete Government Data (Null Coordinates)

Some JPS monitoring stations returned `null` latitude and longitude values, preventing accurate nearest-station detection and distance calculations.

#### ✅ Solution:
- Implemented a backend **data normalization layer** to clean and standardize incoming station data.
- Added a **10-minute caching mechanism** to reduce repeated API calls and improve stability.
- Introduced a **fallback coordinate mapping strategy** for demo-region stations to ensure continuity in risk detection and display.

This ensured reliable nearest-station computation and improved system robustness.

---

### 🔹 Challenge 2: Secure Frontend–Backend Authentication

Ensuring that only authenticated users could access protected backend routes (e.g., `/users`, `/dependents`, `/sos`) required secure token validation beyond frontend-only authentication.

#### ✅ Solution:
- Implemented **Firebase ID token retrieval** on the frontend.
- Verified tokens server-side using the **Firebase Admin SDK**.
- Secured backend routes using middleware-based token validation.
- Structured user data storage under authenticated UID paths:
  - `users/{uid}`
  - `users/{uid}/dependents`

This ensured secure communication between frontend and backend, preventing unauthorized API access.

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


### 📍 Nearby JPS Integration

Users can view:
- Nearest official JPS monitoring station  
- Distance from current location  
- Rainfall (1h & daily)  
- Water level (m)  
- Flood status (Normal / Alert / Warning / Danger)  

This integration increases system credibility and prevents purely AI-based assumptions.

### 🏠 Nearby PPS (JKM) Integration

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

## 📊 Market Validation (Pre-Development Survey) - 🚨 please refer our canva presentaion slides for details

Before development, we conducted a survey (20 respondents) to validate problem relevance and feature priorities.

### Key Findings:
- 95% prioritized personal safety  
- 88.9% preferred personalized AI guidance over generic warnings  
- 88.9% willing to upload photos for AI verification  
- 83% would use BanjirSense if available  
- 72% strongly trust real-time location sharing with authorities  

These findings directly influenced our system architecture and feature prioritization.

---

## 🧪 User Acceptance Testing (UAT) - 🚨 please refer our canva presentaion slides for details

### We conducted structured real-user testing to evaluate:
- Risk clarity  
- AI checklist usefulness  
- Nearby JPS trust impact  
- Shelter map usability  
- SOS confidence level  
- Navigation ease

### 📊 Quantitative Metrics

- **Task completion rate (risk identification):** [XX]%  
- **Average time to complete flood risk check:** [XX] seconds  
- **Average time to activate SOS flow:** [XX] seconds  
- **Clarity rating (1–5 scale):** [X.X] / 5  
- **Users preferring AI-generated checklist over generic warning:** [X]/[TOTAL_TESTERS]  

### Feedback was used to:
- Improve UI clarity  
- Simplify station status labels  
- Enhance emergency flow readability  

---

### 🔁 Key Iterations Implemented Based on Feedback

1. **Improved Government Station Status Clarity**  
   Replaced ambiguous “ERROR” station labels with clearer messaging such as “Data Unavailable” to prevent confusion and increase trust.

2. **Enhanced Trust Through Official Data Visibility**  
   Added visible nearest JPS station distance indicator to reinforce credibility and reduce reliance on AI-only risk assumptions.

3. **Improved Map Reliability & Marker Rendering**
   Users reported that the red user-location marker sometimes disappeared when navigating back to the Home screen.  
   We identified that the legacy `<Marker>` component was unstable during remounting and replaced it with `<MarkerF>`, ensuring consistent rendering across navigation transitions.

4. **Optimized Shelter Capacity Visualization**
   Users found raw victim numbers harder to interpret quickly.  
   We introduced:
   - Color-coded occupancy indicators (🟢 Available, 🟡 Almost Full, 🔴 Full)
   - Automatic occupancy percentage calculation
   - Capacity clamping (0–100%) to prevent invalid display states

5. **Enhanced Shelter Navigation Flow**
   Initially, the “Get Directions” button and shelter information card appeared side-by-side, reducing clarity.  
   Based on usability testing, we:
   - Stacked the action button above the route detail card
   - Auto-focused map to the nearest PPS
   - Displayed structured PPS details (name, location, distance, occupancy)
  
6. **Converted Static Checklist into AI-Generated Checklist**

   Initial prototype used static safety instructions.
   Users indicated that generic instructions felt less trustworthy.

   ✅ Iteration:
   - Replaced static checklist with Gemini-generated dynamic checklist.
   - Checklist now adapts to real-time flood risk level.
   - Tasks are concise, actionable, and context-aware.
  
7. **Improved AI Output Structure for Clarity Under Stress**

   Early Gemini outputs were longer and included explanatory text.
   Test users reported that lengthy instructions reduce clarity in emergency situations.

   ✅ Iteration:
   - Enforced strict output rules (3–8 words, verb-based, no narrative).
   - Limited output to 3–4 concise action steps.
   - Removed unnecessary explanatory text.

   Result: Faster comprehension under high-stress scenarios.
   
8. **Strengthened Trust Through Government + AI Hybrid Model**

   Some users expressed concern about relying purely on AI prediction.

   ✅ Iteration:
   - Combined JPS official station data with AI risk scoring.
   - Displayed nearest JPS station alongside AI risk result.
   - Ensured transparency between data source and AI output.

   This increased perceived reliability and system credibility.

9. **Future AI Severity Validation (Vision API Roadmap)**

   Users were concerned about fake emergency reports.

   ✅ Planned Iteration:
   - Integrate Google Cloud Vision API for water-level image validation.
   - Assist rescue prioritization logic.
   - Reduce false-positive emergency submissions.

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
