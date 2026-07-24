import { Complaint, AIAnalysis, DynamicHeatmapZone, SafetyScoreResult, HotspotDetail } from "../types/safety";
import { createComplaintService } from "./firebaseService";

export type {
  Complaint,
  AIAnalysis,
  DynamicHeatmapZone,
  SafetyScoreResult,
  HotspotDetail,
  SeverityLevel,
  VerificationStatus,
  EscalationState,
  UserProfile,
  GuardianLocation,
  EmergencyAlert,
  IncidentVerification,
  UserLiveLocation
} from "../types/safety";

// Sample complaint blueprints for explicit user seeding (DEMO ONLY)

export const SAMPLE_COMPLAINTS_SEED: Omit<Complaint, "id" | "timestamp" | "count" | "status">[] = [
  {
    type: "harassment",
    label: "Harassment Reported",
    severity: "High",
    description: "Pedestrians reported being followed near the underpass. Poor visibility after 8 PM.",
    anonymous: true,
    lat: 0.005,
    lng: 0.005,
    locationName: "Station Road Underpass"
  },
  {
    type: "lighting",
    label: "Poor Lighting",
    severity: "Medium",
    description: "The streetlights on this stretch have been non-functional for 3 weeks.",
    anonymous: true,
    lat: -0.004,
    lng: 0.003,
    locationName: "MG Road, near Bus Stop 14"
  },
  {
    type: "suspicious",
    label: "Suspicious Activity",
    severity: "Medium",
    description: "Suspicious groups observed following lone pedestrians after dark near temple parking lot.",
    anonymous: true,
    lat: 0.002,
    lng: -0.005,
    locationName: "Temple Rd, Parking Area"
  },
  {
    type: "unsafe_path",
    label: "Unsafe Path",
    severity: "High",
    description: "This lane is unlit and isolated with zero active commercial presence.",
    anonymous: true,
    lat: -0.002,
    lng: -0.003,
    locationName: "Cross Lane 4B, Sector 7"
  }
];

export function getComplaints(): Complaint[] {
  try {
    const data = localStorage.getItem("astra_complaints");
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading safety complaints", e);
  }
  return []; // Default empty for clean fresh start!
}

export function saveComplaints(complaints: Complaint[]) {
  try {
    localStorage.setItem("astra_complaints", JSON.stringify(complaints));
  } catch (e) {
    console.error("Error saving complaints", e);
  }
  // Dispatch a global event so active pages re-render instantly without page reload
  window.dispatchEvent(new Event("astra_complaints_updated"));
}

export function clearDemoMode() {
  try {
    localStorage.removeItem("astra_demo_mode");
    const current = getComplaints().filter(c => !c.id.startsWith("seed-"));
    saveComplaints(current);
  } catch (e) {
    console.error("Error clearing demo mode", e);
  }
}

export function clearComplaints() {
  try {
    localStorage.removeItem("astra_demo_mode");
  } catch (e) {
    console.error("Error clearing demo mode flag", e);
  }
  saveComplaints([]);
}

export async function addComplaint(complaintData: {
  type: string;
  label: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  anonymous: boolean;
  lat: number;
  lng: number;
  locationName: string;
  imageUrl?: string;
  isSos?: boolean;
}): Promise<Complaint> {
  return createComplaintService(complaintData);
}

// Asynchronously analyzes complaint with Gemini backend
async function analyzeComplaintAsync(id: string, complaint: Complaint) {
  try {
    const response = await fetch("/api/analyze-complaint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: complaint.type,
        label: complaint.label,
        description: complaint.description,
        locationName: complaint.locationName,
        timestamp: complaint.timestamp,
      }),
    });

    if (response.ok) {
      const aiAnalysis: AIAnalysis = await response.json();
      const current = getComplaints();
      const index = current.findIndex(c => c.id === id);
      if (index !== -1) {
        current[index].aiAnalysis = aiAnalysis;
        current[index].status = "Analyzed by AI";
        if (aiAnalysis.severity) {
          current[index].severity = aiAnalysis.severity;
        }
        saveComplaints(current);
      }
    }
  } catch (err) {
    console.warn("Async AI analysis failed or running offline:", err);
  }
}

export function seedSampleComplaints(baseCenter: { lat: number; lng: number }) {
  try {
    localStorage.setItem("astra_demo_mode", "true");
  } catch (e) {
    console.error("Error setting demo mode flag", e);
  }
  const seeded: Complaint[] = SAMPLE_COMPLAINTS_SEED.map((sample, idx) => ({
    ...sample,
    id: `seed-${idx}-${Date.now()}`,
    timestamp: `${idx + 1}h ago`,
    status: "Analyzed by AI",
    count: 1,
    aiAnalysis: {
      category: sample.label,
      severity: sample.severity,
      threatLevel: sample.severity,
      confidenceScore: 0.94,
      extractedLocation: sample.locationName,
      extractedTime: `${idx + 1} hours ago`,
      riskIndicators: ["Unlit corridor", "Low pedestrian density"],
      suggestedSafetyAdvice: "Travel via main road with active commercial activity.",
      recommendedAction: "Use well-lit detour along main roads.",
      reasoning: "Assessed based on community incident details.",
      safetyImpactScore: sample.severity === "High" ? 20 : 10,
      summary: sample.description,
    }
  }));
  saveComplaints(seeded);
}

// Dynamic Safety Score Calculation with human-readable "WHY" explanations
export function calculateSafetyScore(complaints: Complaint[]): SafetyScoreResult {
  if (!complaints || complaints.length === 0) {
    return {
      score: 100,
      label: "Optimal Safety Perimeter (Clear)",
      status: "optimal",
      explanations: [
        "Zero safety complaints recorded in your perimeter.",
        "High active lighting & clear pedestrian visibility.",
        "No active threat alerts in the past 30 days."
      ],
      stats: {
        totalComplaints: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        nighttimeCount: 0,
        mostCommonCategory: "None",
        highestRiskLocation: "None",
        safestLocation: "Current Perimeter",
        peakRiskHour: "None",
      }
    };
  }

  let penalty = 0;
  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;
  let nighttimeCount = 0;
  const categoryCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};

  const explanations: string[] = [];

  complaints.forEach(c => {
    const sev = (c.severity || "Medium").toLowerCase();
    const impact = c.aiAnalysis?.safetyImpactScore || (sev === "critical" ? 25 : sev === "high" ? 18 : sev === "medium" ? 10 : 4);
    penalty += impact;

    if (sev === "critical" || sev === "high") highRiskCount++;
    else if (sev === "medium") mediumRiskCount++;
    else lowRiskCount++;

    const cat = c.label || c.type || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    const loc = c.locationName || "Local Corridor";
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;

    if (c.timestamp && (c.timestamp.includes("PM") || c.timestamp.includes("night") || c.timestamp.includes("8:") || c.timestamp.includes("9:"))) {
      nighttimeCount++;
    }
  });

  const finalScore = Math.max(15, Math.min(100, Math.round(100 - penalty)));

  // Generate human-readable "WHY" explanations
  if (highRiskCount > 0) {
    explanations.push(`-${highRiskCount * 18} pts: ${highRiskCount} critical/high-severity incident(s) reported nearby.`);
  }
  if (mediumRiskCount > 0) {
    explanations.push(`-${mediumRiskCount * 10} pts: ${mediumRiskCount} moderate caution report(s) (e.g. poor lighting, suspicious gathering).`);
  }
  if (nighttimeCount > 0) {
    explanations.push(`Time factor: ${nighttimeCount} incident(s) occurred after dark (8 PM – 4 AM).`);
  }

  // Find most common category
  let mostCommonCategory = "General";
  let maxCatCount = 0;
  Object.entries(categoryCounts).forEach(([cat, cnt]) => {
    if (cnt > maxCatCount) {
      maxCatCount = cnt;
      mostCommonCategory = cat;
    }
  });

  // Find highest risk location
  let highestRiskLocation = complaints[0]?.locationName || "Unknown";
  let maxLocCount = 0;
  Object.entries(locationCounts).forEach(([loc, cnt]) => {
    if (cnt > maxLocCount) {
      maxLocCount = cnt;
      highestRiskLocation = loc;
    }
  });

  if (maxCatCount > 1) {
    explanations.push(`Clustering alert: ${maxCatCount} reports of '${mostCommonCategory}' clustered near ${highestRiskLocation}.`);
  } else {
    explanations.push(`Perimeter status based on ${complaints.length} community report(s).`);
  }

  let status: "optimal" | "moderate" | "caution" | "critical" = "optimal";
  let label = "High Safety Zone";

  if (finalScore >= 85) {
    status = "optimal";
    label = "High Safety Zone";
  } else if (finalScore >= 65) {
    status = "moderate";
    label = "Moderate Safety Zone";
  } else if (finalScore >= 45) {
    status = "caution";
    label = "Heightened Caution Zone";
  } else {
    status = "critical";
    label = "Critical Threat Alert Zone";
  }

  return {
    score: finalScore,
    label,
    status,
    explanations,
    stats: {
      totalComplaints: complaints.length,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      nighttimeCount,
      mostCommonCategory,
      highestRiskLocation,
      safestLocation: "Main Highway / Station Perimeter",
      peakRiskHour: "8:00 PM – 11:00 PM",
    }
  };
}

// Compute Heatmap Risk Zones dynamically from complaint spatial clusters
export function computeHeatmapZones(complaints: Complaint[], baseCenter = { lat: 12.9352, lng: 77.6245 }): DynamicHeatmapZone[] {
  if (!complaints || complaints.length === 0) {
    return [];
  }

  return complaints.map((c) => {
    const latDiff = (c.lat - baseCenter.lat) * 2000;
    const lngDiff = (c.lng - baseCenter.lng) * 2000;

    let cx = 50 + lngDiff;
    let cy = 50 - latDiff;

    cx = Math.max(15, Math.min(85, cx));
    cy = Math.max(15, Math.min(85, cy));

    const sev = (c.severity || "Medium").toLowerCase();
    const level: "safe" | "caution" | "danger" =
      sev === "high" || sev === "critical" ? "danger" : sev === "medium" ? "caution" : "safe";

    return {
      id: c.id,
      label: c.locationName || c.label,
      level,
      cx,
      cy,
      rx: level === "danger" ? 14 : 10,
      ry: level === "danger" ? 10 : 8,
      incidents: c.count || 1,
      desc: c.description || `${c.label} reported`,
      tip: c.aiAnalysis?.recommendedAction || "Stay alert and travel via well-lit pathways.",
      centerLat: c.lat,
      centerLng: c.lng,
    };
  });
}

// Get comprehensive Hotspot Details for map modal inspection
export function getHotspotDetails(complaint: Complaint): HotspotDetail {
  const sev = complaint.severity || "Medium";
  const score = sev === "Critical" ? 25 : sev === "High" ? 45 : sev === "Medium" ? 68 : 88;

  return {
    id: complaint.id,
    areaName: complaint.locationName || "Reported Area",
    safetyScore: score,
    complaintCount: complaint.count || 1,
    mostCommonIncident: complaint.label || complaint.type,
    averageSeverity: sev,
    mostRecentComplaint: `${complaint.timestamp} (${complaint.status})`,
    recommendedPrecautions: complaint.aiAnalysis?.suggestedSafetyAdvice || complaint.aiAnalysis?.recommendedAction || "Avoid unlit paths and walk in well-frequented corridors.",
    riskIndicators: complaint.aiAnalysis?.riskIndicators || [
      "Poor Street Lighting",
      "Low Pedestrian Traffic",
      "Reported Stalking Risk"
    ],
    nearbyFacilities: [
      { name: "Sector Police Helpdesk", distance: "320m", type: "Police" },
      { name: "City Care Hospital Emergency", distance: "550m", type: "Hospital" },
      { name: "24/7 Verified Safe Haven Store", distance: "180m", type: "Safe Haven" },
    ],
  };
}

