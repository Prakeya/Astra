# Astra: AI-Powered Personal Safety Platform for Women

Astra is a full-stack personal safety application that combines real-time navigation, AI-driven incident classification, and a community guardian network to help women move through public spaces more safely. The platform pairs a React and TypeScript frontend with an Express backend and Google Gemini for structured threat analysis, backed by Firebase for real-time data synchronization.

## Overview

Astra addresses three core problems in personal safety technology: incident data that is scattered and unverified, routing that ignores real-world risk, and emergency response that depends on a single point of failure (typically one phone call). The platform solves this by continuously classifying community-reported incidents with AI, factoring that data into route recommendations, and coordinating a distributed network of community guardians who can respond in real time.

## Core Features

**Live Walk Mode**
A guided navigation mode that tracks the user's route in real time, factoring in nearby reported incidents. Users can search destinations from a curated list of common locations across major Indian cities or enter a custom address, and the system recalculates safer paths as new incidents are logged.

**Voice-Activated Emergency Trigger**
A hands-free safety mechanism built on the Web Audio API that listens for configurable trigger phrases (for example, "Astra help" or "Astra SOS") and initiates an emergency response without requiring the user to touch their device. Sensitivity is user-adjustable, and the feature includes a built-in test mode.

**Distraction Call Simulation**
A simulated incoming phone call feature with pre-written, contact-specific conversation scripts, designed to give users a natural-looking reason to alter their route or deter a potential threat in an uncomfortable situation.

**Check-In Timer**
A configurable safety timer that prompts the user for periodic check-ins during a walk. Missed check-ins trigger a grace period followed by an automated alert, giving trusted contacts visibility into the user's status without constant manual updates.

**AI-Powered Incident Classification**
User-submitted incident reports are sent to Google Gemini, which returns structured output including severity, threat level, confidence score, extracted location and time, key risk indicators, and recommended safety actions. The backend includes a graceful fallback response when no API key is configured, so the application remains functional in development or demo environments.

**AI Safety Assistant**
A conversational assistant, grounded in the live complaint database, that answers natural-language questions about safety conditions in a given area and provides situational guidance.

**AI-Explained Safe Routing**
When incidents are present along a route, the backend calls Gemini to generate a short, human-readable explanation of why a particular path was chosen over the shortest route, citing the specific hazards it avoids.

**Community Guardian Network**
A verified guardian system with a structured onboarding flow that includes government ID upload, address proof, video verification, and a probationary period before guardians can go active. Verified guardians can toggle their availability and are matched to nearby emergency alerts in real time through Firebase.

**Trust-Based Incident Verification**
Community members can confirm or dispute reported incidents, which adjusts a trust score attached to each report and determines whether it receives a verified badge and greater weight in safety calculations.

**Real-Time Safety Dashboard**
A dynamic safety score, computed from live incident data, along with a heatmap of nearby risk zones, a community impact dashboard, and an auditable timeline of report submission, AI classification, and score updates.

**SOS and Emergency Escalation**
A dedicated SOS flow that immediately escalates high and critical severity incidents, creating emergency alert records and notifying nearby active guardians with real-time location sharing.

## Technical Architecture

**Frontend**
Built with React 19 and TypeScript, using Vite for the build tooling and Tailwind CSS for styling. The UI layer is composed with shadcn/ui components on top of Radix UI primitives, with Framer Motion for animation, TanStack Query for data fetching and caching, React Hook Form with Zod for form validation, and wouter for lightweight client-side routing.

**Backend**
An Express server (running on Node.js with TypeScript via tsx) exposes REST endpoints that proxy requests to the Google Gemini API, handling incident analysis, conversational assistance, and route explanation. In development, the Express server runs Vite in middleware mode; in production, it serves the built static assets directly.

**Data Layer**
Firebase Firestore provides real-time synchronization across five core collections: complaints, users, guardians, emergencies, and verifications. The frontend subscribes directly to Firestore for live updates on incidents, guardian availability, emergency alerts, and shared user locations, so changes propagate to all connected clients without manual polling.

**AI Integration**
Google Gemini (accessed through the @google/genai SDK) is used with structured JSON schema responses for incident classification, ensuring consistent, typed output that the frontend can render without additional parsing logic.

**Mapping**
Google Maps JavaScript API, integrated through @react-google-maps/api, powers live location tracking, route rendering, and the incident heatmap.

## Environment Setup

### Prerequisites
- Node.js 20 or later
- npm, pnpm, or bun

### Configuration
Copy `.env.example` to `.env` and provide the following:

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Firebase configuration (optional; the app falls back to a local data engine if omitted)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### Running Locally
```bash
npm install
npm run dev
```
The application runs at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
src/
  components/       Shared UI components (map, SOS button, AI assistant drawer, panels)
  components/ui/    shadcn/ui component library
  pages/            Route-level views (Walk Mode, SOS, Check-In Timer, Guardian Onboarding, etc.)
  lib/               Firebase service layer, safety scoring engine, and local data store
  types/             Shared TypeScript types for complaints, guardians, and safety data
server.ts            Express server and Gemini API proxy endpoints
```

## Mission

Astra was built to give women greater confidence and control while moving through public spaces, using real-time community data and AI-driven risk intelligence to make everyday navigation safer.
