# Astra — You Are Never Alone

Women-first predictive safety companion app with 10 autonomous agents, guardian network, and community safety intelligence.

## Run & Operate

- `pnpm --filter @workspace/astra run dev` — run the Astra frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React 18 + Vite + Tailwind CSS v4
- wouter for client-side routing
- Recharts for data visualization
- All data stored in localStorage (mock/demo; Firebase-ready)
- 10 autonomous agents in `src/agents/`

## Where things live

- `artifacts/astra/src/pages/` — all 9 pages (Landing, Dashboard, WalkMode, SOS, SafeNow, ReportIssue, GuardiansNearby, Profile, History, Alerts)
- `artifacts/astra/src/components/` — reusable UI components
- `artifacts/astra/src/agents/` — 10 agent modules (guardian, prediction, trust, companion, emergency, municipality, route, alert, helpPoint, companion)
- `artifacts/astra/src/context/AppContext.tsx` — global state (user, incidents, preferences)
- `artifacts/astra/src/data/` — sample data (guardians, incidents, journeys)
- `artifacts/astra/src/engine/` — safetyEngine, trustEngine
- `artifacts/astra/src/lib/verification.ts` — join request scoring

## Color Palette

- Cream background: `#FDF6E3` → `hsl(43 89% 94%)`
- Deep indigo text: `#3D405B` → `hsl(235 19% 30%)`
- Terracotta primary: `#E07A5F` → `hsl(12 65% 63%)`
- Sage green safe: `#81B29A` → `hsl(151 21% 60%)`
- Soft gold guardians: `#F2CC8F` → `hsl(38 79% 75%)`

## Architecture decisions

- All data stored in localStorage for demo; designed to swap to Firestore (data model matches spec exactly)
- wouter used instead of react-router-dom (workspace standard)
- 10 agent modules are pure functions — deterministic, testable, no side effects
- AppContext wraps all global state (user profile, incidents, alert preferences)
- MapPanel is an SVG-based mock map (no Google Maps API key required for demo)

## Product

- Landing page with hero, stats, how-it-works, testimonials, and CTA
- Dashboard with safety score, live map, quick actions, and 12 expandable agent output cards
- Walk Mode with live map, ETA, guardian count, check-in, I'm Safe, and SOS buttons
- SOS screen with real-time responder list, guardian status, alarm/flash deterrents
- Safe Now celebration screen with guardian thank-you list and star ratings
- Report Issue with photo/voice/text, category picker, severity slider, anonymous toggle
- Guardians Nearby with available/unavailable list, request help, become a guardian toggle
- Profile/Settings with editable trusted contacts, safe zones, alert preferences, emergency settings

## User preferences

- No emojis in the main app UI (landing page uses them sparingly)
- Output as normal files (not zip) for GitHub push

## Gotchas

- MapPanel is SVG-based mock; swap to `@vis.gl/react-google-maps` when a Google Maps API key is available
- All `IncidentType` values must match the union type in `src/data/sampleIncidents.ts`
- The not-found page is at `src/pages/not-found.tsx` (lowercase, kebab-case)
