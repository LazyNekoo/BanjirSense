# 🌊 BanjirSense
## AI-Powered Flood Prediction, Survival Guidance & National Response Coordination System

> Not just preventive — but responsive and actionable.

---

## 🚨 Problem Statement

Malaysia experiences recurring large-scale monsoon floods and sudden urban flash floods that disrupt communities, displace thousands, and strain emergency response systems every year.

While official platforms such as **Public InfoBanjir (JPS)**, **MyCuaca**, and **NADMA** provide rainfall data, river levels, and disaster updates, they primarily function as monitoring systems rather than real-time decision-support tools.

There remains a critical gap between:

- Flood monitoring  
- Personalized risk understanding  
- Immediate action guidance  
- Structured citizen-to-authority coordination  

During flood emergencies, individuals often face:

- Uncertainty about what actions to take  
- Lack of location-specific risk clarity  
- Delays in reporting distress situations  
- Difficulty communicating severity and special needs  
- Limited structured coordination between affected individuals and responders  

Flash floods, in particular, occur rapidly with minimal warning — leaving victims little time to prepare or evacuate.

> The challenge is not the absence of flood data —  
> but the absence of actionable, AI-powered decision support and coordinated response infrastructure.

---

## 📊 Current Malaysia Flood Context

Recent flood events have displaced thousands across multiple states, with recurring monsoon and flash flood incidents affecting urban and rural communities alike.

Examples from late 2025 to early 2026 include:
- Thousands evacuated across multiple states during monsoon floods
- Urban flash floods disrupting transportation corridors
- Sudden water surges in cities such as Shah Alam and Ipoh

These recurring events highlight the urgent need for:
- Faster decision-making tools
- Real-time risk visibility
- Structured emergency coordination systems

---

## 🌍 SDG Alignment & Target Contribution

BanjirSense aligns with the following United Nations Sustainable Development Goals (SDGs) and specific targets:

---

### 🌆 SDG 11 — Sustainable Cities & Communities

**Target 11.5**  
> Significantly reduce the number of deaths and the number of people affected by disasters, including water-related disasters, and substantially decrease direct economic losses.

**How BanjirSense Contributes:**
- Provides early flood risk clarity through AI-based prediction
- Enables faster evacuation decisions
- Supports structured rescue prioritization
- Reduces confusion during emergency situations

---

### 🌱 SDG 13 — Climate Action

**Target 13.1**  
> Strengthen resilience and adaptive capacity to climate-related hazards and natural disasters in all countries.

**How BanjirSense Contributes:**
- Enhances climate adaptation through AI-driven flood risk forecasting
- Integrates real-time official flood monitoring data
- Strengthens community-level disaster preparedness
- Improves coordinated response mechanisms

---

### ❤️ SDG 3 — Good Health & Well-Being

**Target 3.d**  
> Strengthen the capacity for early warning, risk reduction, and management of national and global health risks.

**How BanjirSense Contributes:**
- Improves early warning clarity using AI-generated guidance
- Reduces emergency response delays
- Supports structured distress communication
- Enhances survival preparedness during flood events

---

## 🎯 Core Problem Summary

Flood monitoring systems exist.

Flood response data exists.

However, there is a missing layer between:

Data → Decision → Action → Coordination

BanjirSense addresses this gap by transforming passive flood information into:

- Predictive risk assessment  
- Personalized survival guidance  
- Real-time distress reporting  
- Structured rescue coordination  

This shifts disaster management from reactive monitoring to predictive, guided, and coordinated response.

---

## 💡 Solution Overview

BanjirSense is an AI-powered disaster management system that supports users across the full flood lifecycle:

### 1️⃣ Before Flood — Predict & Prepare
- Location-aware flood risk scoring  
- Official JPS (Public InfoBanjir) & JKM integration  
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
## 🚀 How to Run BanjirSense Locally

### 📦 Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- npm
- Git

---

#### 📂 1) Clone the Repository

```bash
git clone https://github.com/your-username/BanjirSense.git
cd BanjirSense
```
#### ⚙️ 2) Setup Environment Variables

🔹 Backend (/backend)
Create a .env file inside /backend:
```bash
PROJECT_ID=
FIREBASE_PROJECT_ID=
REGION=
GEMINI_API_KEY=
GEMINI_MODEL=
GOOGLE_MAP_API_KEY=
```

🔹 Frontend (/frontend)
Create a .env file inside /frontend:
```bash
VITE_PORT=5173
VITE_API_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_GOOGLE_MAPS_API_KEY=
```

#### 🔐 3) Firebase Service Account Setup (Backend)

Inside the `backend` folder, create a directory called:
backend/keys/
Place your Firebase Admin SDK service account file inside: <br>
backend/keys/serviceAccount.json

#### 🖥️ 4) Install Dependencies
🔹 Backend
```bash
cd backend
npm install
```

🔹 Frontend
```bash
cd ../frontend
npm install
```

#### ▶️ 5) Run the System

🔹 Start Backend Server
```bash
cd backend
node server.js
```

🔹 Start Frontend
```bash
cd frontend
npm run dev
```

#### 🧠 6) Development Notes
- Backend must run before frontend.
- Ensure Firebase credentials are valid.
- Ensure Gemini API key is active.
- Government API endpoints (JPS / JKM) require internet access.


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
## 🛠️ Coding Challenge Faced During Development

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

### 🔹 Challenge 3: Government API Payload Shape Variability

The JPS and JKM endpoints returned inconsistent response formats:
- Sometimes `{ ok, shelters: [...] }`
- Sometimes raw arrays `[...]`
- Sometimes nested objects like `{ points: [...] }`

This created runtime instability in the frontend.

#### ✅ Solution:
- Implemented defensive response parsing logic
- Added fallback extraction checks
- Created normalization helpers before UI rendering
- Ensured frontend only consumes standardized data structure

This improved system robustness against unpredictable external APIs.

---

### 🔹 Challenge 4: Balancing AI Automation with Ethical Responsibility

Using AI for emergency prioritization raises ethical concerns:
- Over-prioritization risk
- False positives
- Bias in severity detection

#### ✅ Engineering Decision:
- Combine AI output with official government data
- Plan Vision API validation before automatic prioritization
- Keep human-in-the-loop rescue coordination concept

This ensures responsible AI deployment in disaster management.

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

## 📊 Market Validation 

---

## 📊 Market Validation 

Before development, we conducted a survey (20 respondents) to validate problem relevance and feature priorities.

### Key Findings:
- 95% prioritized personal safety  
- 88.9% preferred personalized AI guidance over generic warnings  
- 88.9% willing to upload photos for AI verification  
- 83% would use BanjirSense if available  
- 72% strongly trust real-time location sharing with authorities  

These findings directly influenced our system architecture and feature prioritization.
  
---
## 🧪 User Acceptance Testing 

###  Testing Process : 

- Recruited 4 external participants (non-team members).
- Asked users to perform specific tasks:
  - Identify flood risk level
  - Interpret JPS station data
  - Navigate to nearest PPS
  - Activate SOS flow
- Observed completion behavior and usability friction points.
- Collected structured feedback through a post-test survey form.

### 🔁 Specific implementations based on user input during UAT

1. **Enhanced Trust Through Official Data Visibility**  
   User wanted stronger transparency in risk calculation.

    ✅ Iteration:
    - Added visible nearest JPS station distance
    - Displayed official rainfall & water level alongside AI risk

2. **Improved Map Reliability & Marker Rendering**
   User location marker disappeared during navigation transitions.

   ✅ Iteration:
    - Replaced unstable <Marker> with <MarkerF>
    - Ensured consistent rendering on component remount

3. **Optimized Shelter Capacity Visualization**
   Found raw victim numbers harder to interpret quickly.
   
    ✅ Iteration:
   - Color-coded occupancy indicators (🟢 Available, 🟡 Almost Full, 🔴 Full)
   - Automatic occupancy percentage calculation
   - Capacity clamping (0–100%) to prevent invalid display states

4. **Enhanced Shelter Navigation Flow**
   Initially, the “Get Directions” button and shelter information card appeared side-by-side, reducing clarity.  

   ✅ Iteration:
   - Stacked the action button above the route detail card
   - Auto-focused map to the nearest PPS
   - Displayed structured PPS details (name, location, distance, occupancy)
  
---

## 📊 Impact & Success Metrics (Post-Development)

Based on structured UAT with **4 external participants**:

---

### ⏱ Speed & Efficiency

- **Average Flood Risk Identification Time:** 26.25 seconds  
- **Average SOS Activation Time:** 32.5 seconds  

These results demonstrate fast decision-making and emergency usability under 1 minute.

---

### 📈 Clarity & Guidance Effectiveness

- **Risk Clarity Rating:** 4.5 / 5 (90%)  
- **AI Checklist Helpfulness:** 4.75 / 5 (90%)  

Users reported strong understanding of their flood risk and found AI-generated preparation steps highly actionable.

---

### 🤝 Trust & Credibility

- **75% reported increased trust** after viewing the nearest official JPS station  
- **25% reported slight trust increase**  
- **0 negative trust impact**

This validates the hybrid **AI + official government data** approach.

---

### 🧭 User Experience Quality

- **Navigation Ease Score:** 5 / 5 (100%)

All users reported smooth and intuitive navigation across the system.

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

## 🚀 Scalability & Deployment Roadmap

BanjirSense is designed with long-term scalability, government integration readiness, and multi-disaster expansion in mind.

---

### 📍 Phase 1 — Pilot Deployment

- University / small district testing  
- 100–500 user simulation  
- Firebase Spark plan (initial scaling)  
- Collect usability & emergency response metrics  

**Goal:** Validate performance, usability, and real-world responsiveness under controlled pilot conditions.

---

### 🏙️ Phase 2 — District-Level Integration
 
- Collaboration with local council authorities  
- Authority dashboard (beta release)  
- Stress testing during heavy rainfall events  

**Goal:** Enable structured coordination between citizens and district-level emergency responders.

---

### 🌐 Phase 3 — National Scaling

- Multi-state deployment  
- Auto-scaling cloud backend  
- Government SaaS licensing model  
- Expansion to multi-disaster coverage (landslides, storms)  

**Goal:** Transform BanjirSense into a nationally deployable disaster management platform.

---

## ☁️ Cloud Scalability Architecture

BanjirSense is built using a serverless, auto-scaling cloud model:

- Built on Google Cloud infrastructure  
- Firebase auto-scales under high user load  
- Modular AI components (Vertex AI, Gemini, Vision API)  
- API-ready for government system integration  

This ensures resilience during high-traffic flood emergencies.

---

## 🌱 Sustainability Model

To ensure long-term viability and national adoption:

- Free public access for citizens  
- Government SaaS dashboard subscription  
- Insurance & disaster-risk analytics partnerships  
- Corporate Social Responsibility (CSR) sponsorship programs  

This hybrid sustainability approach balances public benefit with operational continuity.

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
- Offline SOS Capability

---

## 🎥 Live Demo & Presentation

🎬 **Demo Video:**  
`[Insert Video Link Here]`

📊 **Pitch Deck (Canva):**  
`[Insert Canva View-Only Link Here]`

---

## 👥 Team

### 👨‍💻 Luqman Naqiuddin bin Zulhaimi
**Role:** Team Leader & Frontend Developer <br>
📧 Email: luqmannaqiuddin17@gmail.com

### 👩‍💻 Siti Fatimah Binti Saniy Wong  
**Role:** Backend Developer & System Integration  
📧 Email: minsugar2203@gmail.com  
 

---

Built for **KitaHack 2026**  
AI for Disaster Management & Climate Resilience
