# ASTRA

An AI-powered women safety platform that combines intelligent incident analysis, safe-route recommendations, community-assisted emergency response, and real-time geospatial monitoring using Gemini AI, Firebase, and Google Maps.

**Live Demo:** https://astra-c991e.web.app

---

## Overview

ASTRA is a full-stack women safety platform designed to improve situational awareness and emergency response through AI-assisted incident classification, real-time location sharing, and community-driven safety intelligence.

The platform enables users to report safety incidents, visualize risk hotspots, discover safer travel routes, coordinate with nearby community guardians, and receive contextual safety recommendations through an interactive dashboard.

---

## Key Features

### AI-Powered Incident Intelligence

- Gemini-powered incident classification
- Severity prediction and threat assessment
- Confidence scoring and reasoning
- Context-aware safety recommendations
- AI Safety Assistant for safety-related queries

### Safe Route Recommendation

- Incident-aware route planning
- Dynamic safety score calculation
- Hotspot avoidance
- Route comparison with safety explanations
- Nearby emergency facility awareness

### Community Guardian Network

- Community guardian availability
- Guardian-assisted emergency response
- Live guardian visibility
- Emergency coordination workflow

### Trust-Based Incident Verification

- Community reporting
- Trust score computation
- Incident verification workflow
- Automated escalation pipeline

### Interactive Safety Dashboard

- Real-time incident monitoring
- Safety analytics
- Dynamic hotspot visualization
- Activity timeline
- Incident severity distribution
- Safety score insights

### Interactive Safety Map

- Google Maps integration
- Live incident visualization
- Safety hotspots
- Guardian locations
- Emergency facility markers

### Firebase Integration

- Firebase Authentication
- Cloud Firestore
- Real-time data synchronization
- Location sharing
- Firebase Cloud Messaging support
- Firebase Hosting deployment

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Backend

- Node.js
- Express
- Google Gemini API

### Cloud Platform

- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Messaging
- Firebase Hosting

### Maps & Location

- Google Maps JavaScript API
- Browser Geolocation API

---

## System Workflow

1. User submits a safety incident.
2. Gemini AI classifies the incident and estimates its severity.
3. Incident data is stored and synchronized through Firestore.
4. Safety scores and hotspot regions are updated dynamically.
5. The dashboard and map refresh in real time.
6. Safer travel routes are generated based on nearby incidents.
7. Community guardians and emergency workflows are updated.
8. Users receive contextual safety guidance through the AI Safety Assistant.

---

## Repository Structure

```text
src/
├── components/
├── hooks/
├── lib/
│   ├── firebase.ts
│   ├── firebaseService.ts
│   └── safetyStore.ts
├── pages/
├── types/
└── App.tsx

public/
└── firebase-messaging-sw.js

server.ts
firebase.json
```

---

## Local Setup

Clone the repository

```bash
git clone https://github.com/Prakeya/Astra.git
cd Astra
```

Install dependencies

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Start the development server

```bash
npm run dev
```

Create a production build

```bash
npm run build
```

---

## Deployment

The application is deployed using Firebase Hosting.

```bash
firebase deploy
```

Live Application

https://astra-c991e.web.app

---

## Future Enhancements

- Predictive hotspot forecasting
- Advanced emergency dispatch optimization
- Wearable device integration
- Offline emergency reporting
- Administrative analytics dashboard
- Multi-language support

---

## License

Developed as an academic, research, and portfolio project.
