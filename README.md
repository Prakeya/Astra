# ASTRA — AI-Powered Women's Personal Safety & Dynamic Navigation Platform

**ASTRA** is a production-grade, AI-powered women’s personal safety platform designed to provide real-time threat intelligence, dynamic safe route recommendations, community guardian matching, and automated emergency escalation.

By combining Google Gemini AI threat classification with Firebase real-time data sync, ASTRA transforms community safety reports into actionable, hyper-local risk intelligence.

---

## 🌟 Key Features

### 1. 🤖 Gemini AI Threat Analysis & Classification
- **Structured Risk Intelligence**: Evaluates incident type, location, severity (`Low`, `Medium`, `High`, `Critical`), threat level, AI confidence score, extracted timeframe, key risk indicators, and recommended safety advice.
- **Automated Severity Assessment**: Dynamically determines perimeter safety impact score reductions.
- **AI Safety Assistant**: Instant natural language Q&A regarding live safety conditions and emergency guidance.

### 2. 🗺️ Dynamic Safe Route Recommendation Engine
- **Multi-Factor Scoring**: Calculates optimal walking routes based on complaint density, incident severity, recency, trust scores, verified badges, and nearby emergency facilities.
- **Human-Readable Explanations**: Generates clear natural language explanations detailing which hazards (e.g. unlit lanes, reported stalking spots) were bypassed.
- **Dynamic Detour Routing**: Automatically updates recommended routes when new complaints or emergency alerts are logged.

### 3. 🛡️ Community Guardian Network & Matching
- **Guardian Mode**: Community members can publish availability, live coordinates, and coverage radius (`guardians` collection).
- **Automated Escalation & Dispatch**: When high/critical incidents or SOS alerts occur, nearby active guardians receive automated dispatch notifications with estimated arrival time and route.

### 4. ⚡ Real-Time Emergency Response & Escalation
- **Automated Threat Escalation**: High/Critical severity incidents automatically trigger emergency alert records in the `emergencies` collection.
- **Live Emergency Banners**: Persistent real-time notification alerts across active views when an emergency escalation is active.

### 5. 👥 Trust-Based Incident Verification
- **Community Audit Trail**: Members can "Confirm Incident" or "Report False Alarm" to dynamically adjust complaint trust scores.
- **Verified Badging**: Incidents exceeding trust thresholds earn a visual "Verified Report ✓" badge and higher weight in route calculations.

### 6. 📊 Real-Time Safety Intelligence Dashboard
- **Dynamic Safety Perimeter Score**: Computed strictly from actual complaint data (100-point scale with "WHY" factor explanations).
- **Hotspot Heatmap Intelligence**: Spatial cluster analysis detailing nearby police helpdesks, ER facilities, and safe havens.
- **Real-Time Pipeline Timeline**: Transparent audit trail showing complaint submission, Gemini classification, score recalculation, and route updates.

---

## 🏗️ Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    ASTRA Client UI                      │
│     (React 19 + TypeScript + Vite + Tailwind CSS)       │
└───────────┬─────────────────────────────────┬───────────┘
            │                                 │
            ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│    Gemini AI Engine     │       │  Firebase Modular SDK   │
│  (server.ts Proxy API)  │       │  (Firestore + Auth)     │
└───────────┬─────────────┘       └───────────┬─────────────┘
            │                                 │
            ▼                                 ▼
 ┌───────────────────────┐       ┌─────────────────────────┐
 │   gemini-3.6-flash    │       │  Firestore Collections  │
 │ Structured Extraction │       │ • complaints            │
 └───────────────────────┘       │ • users                 │
                                 │ • guardians             │
                                 │ • emergencies           │
                                 │ • verifications        │
                                 └─────────────────────────┘
```

---

## 🗄️ Firestore Collections & Data Model

### 1. `complaints`
```json
{
  "id": "report-1710000000000",
  "type": "harassment",
  "label": "Harassment Reported",
  "severity": "High",
  "description": "Pedestrians followed near underpass.",
  "anonymous": true,
  "timestamp": "08:30 PM",
  "lat": 11.128,
  "lng": 78.658,
  "locationName": "Station Road Underpass",
  "status": "Guardian Alerted",
  "reporterId": "user_123",
  "trustScore": 85,
  "confirmationsCount": 3,
  "falseReportsCount": 0,
  "verificationStatus": "verified",
  "escalationState": "escalated",
  "isEmergency": true,
  "geminiConfidence": 0.94,
  "aiAnalysis": {
    "category": "Harassment",
    "severity": "High",
    "threatLevel": "High",
    "confidenceScore": 0.94,
    "riskIndicators": ["Poor Lighting", "Low Pedestrian Density"],
    "suggestedSafetyAdvice": "Travel via illuminated main road.",
    "recommendedAction": "Use well-lit detour along main roads.",
    "reasoning": "High threat assessment based on report density.",
    "safetyImpactScore": 20,
    "summary": "Stalking risk identified in underpass corridor."
  }
}
```

### 2. `guardians`
```json
{
  "uid": "guardian_456",
  "displayName": "Patrol Unit Alpha",
  "lat": 11.128,
  "lng": 78.658,
  "available": true,
  "radiusKm": 3.0,
  "trustRating": 4.9,
  "lastUpdated": "2026-07-23T09:30:00Z"
}
```

### 3. `emergencies`
```json
{
  "id": "emerg-report-1710000000000",
  "complaintId": "report-1710000000000",
  "severity": "High",
  "locationName": "Station Road Underpass",
  "lat": 11.128,
  "lng": 78.658,
  "timestamp": "2026-07-23T09:30:00Z",
  "status": "escalated",
  "notifiedGuardiansCount": 3,
  "summary": "Pedestrians followed near underpass."
}
```

---

## 🚀 Environment Setup & Local Execution

### 1. Prerequisites
- Node.js 20+
- npm / pnpm / bun

### 2. Environment Variables Configuration (`.env`)
Copy `.env.example` to `.env`:

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Firebase Modular SDK Configuration (Optional - falls back gracefully to local engine)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🛡️ License & Mission
Built to ensure safe mobility for women worldwide through real-time community solidarity and advanced AI risk intelligence.
