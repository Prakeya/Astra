export type SafetyLevel = "safe" | "caution" | "danger";

export interface Zone {
  id: string;
  label: string;
  level: SafetyLevel;
  cx: number; cy: number; rx: number; ry: number;
  incidents: number;
  desc: string;
  tip: string;
}

export const ZONES: Zone[] = [
  { id: "z1", label: "Station Road", level: "danger", cx: 28, cy: 38, rx: 12, ry: 9,
    incidents: 4, desc: "4 incidents this week — harassment & poor lighting",
    tip: "Avoid after 8 PM. Use the main road instead." },
  { id: "z2", label: "Park Street", level: "caution", cx: 68, cy: 28, rx: 11, ry: 8,
    incidents: 2, desc: "2 incidents — dim streetlights reported",
    tip: "Walk in groups. Lights expected to be fixed Fri." },
  { id: "z3", label: "MG Road", level: "safe", cx: 55, cy: 58, rx: 14, ry: 7,
    incidents: 0, desc: "No incidents in the last 7 days",
    tip: "Well-lit, active area. Recommended route." },
  { id: "z4", label: "College Area", level: "safe", cx: 80, cy: 65, rx: 10, ry: 8,
    incidents: 0, desc: "Guardian presence high — 3 active nearby",
    tip: "Safe zone. Guardians patrolling." },
  { id: "z5", label: "Auto Stand", level: "danger", cx: 18, cy: 68, rx: 9, ry: 8,
    incidents: 3, desc: "3 recent reports — suspicious activity",
    tip: "Use only during daytime. Avoid solo walks." },
  { id: "z6", label: "Market Lane", level: "caution", cx: 42, cy: 80, rx: 10, ry: 6,
    incidents: 1, desc: "1 incident — unsafe path reported",
    tip: "Moderate caution. Busy during the day." },
  { id: "z7", label: "Hospital Rd", level: "safe", cx: 72, cy: 85, rx: 8, ry: 6,
    incidents: 0, desc: "Well-lit, 24-hour activity area",
    tip: "Very safe — hospital security present." },
];

export const LEVEL_FILL: Record<SafetyLevel, string> = {
  safe: "rgba(34,197,94,0.18)",
  caution: "rgba(251,191,36,0.18)",
  danger: "rgba(232,93,122,0.22)",
};

export const LEVEL_STROKE: Record<SafetyLevel, string> = {
  safe: "rgba(34,197,94,0.55)",
  caution: "rgba(251,191,36,0.55)",
  danger: "rgba(232,93,122,0.60)",
};

export const LEVEL_COLOR: Record<SafetyLevel, string> = {
  safe: "#22c55e",
  caution: "#fbbf24",
  danger: "#e85d7a",
};
