export interface AIAnalysis {
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  threatLevel: "Low" | "Medium" | "High" | "Critical";
  recommendedAction: string;
  safetyImpactScore: number;
  summary: string;
}

export interface Complaint {
  id: string;
  type: string;
  label: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  anonymous: boolean;
  timestamp: string;
  lat: number;
  lng: number;
  locationName: string;
  imageUrl?: string;
  status: "Reported" | "Analyzed by AI" | "Under Review" | "Guardian Alerted" | "Resolved";
  aiAnalysis?: AIAnalysis;
  count: number;
  isSos?: boolean;
}

export interface DynamicHeatmapZone {
  id: string;
  label: string;
  level: "safe" | "caution" | "danger";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  incidents: number;
  desc: string;
  tip: string;
  centerLat: number;
  centerLng: number;
}

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

export function clearComplaints() {
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
  const current = getComplaints();
  const id = `report-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newComplaint: Complaint = {
    ...complaintData,
    id,
    timestamp: nowStr,
    status: "Reported",
    count: 1
  };

  // Save immediately
  const updated = [newComplaint, ...current];
  saveComplaints(updated);

  // Trigger AI Analysis asynchronously
  analyzeComplaintAsync(id, newComplaint);

  return newComplaint;
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
      recommendedAction: "Use well-lit detour along main roads.",
      safetyImpactScore: sample.severity === "High" ? 20 : 10,
      summary: sample.description,
    }
  }));
  saveComplaints(seeded);
}

// Dynamic Safety Score Calculation
export function calculateSafetyScore(complaints: Complaint[]): { score: number; label: string; status: "optimal" | "moderate" | "caution" | "critical" } {
  if (!complaints || complaints.length === 0) {
    return { score: 100, label: "Optimal Safety Perimeter (Clear)", status: "optimal" };
  }

  let penalty = 0;
  complaints.forEach(c => {
    const sev = c.severity ? c.severity.toLowerCase() : "medium";
    if (sev === "critical") penalty += 25;
    else if (sev === "high") penalty += 18;
    else if (sev === "medium") penalty += 10;
    else penalty += 4;
  });

  const finalScore = Math.max(15, Math.min(100, Math.round(100 - penalty)));

  if (finalScore >= 85) return { score: finalScore, label: "High Safety Zone", status: "optimal" };
  if (finalScore >= 65) return { score: finalScore, label: "Moderate Safety Zone", status: "moderate" };
  if (finalScore >= 45) return { score: finalScore, label: "Heightened Caution Zone", status: "caution" };
  return { score: finalScore, label: "Critical Alert Area", status: "critical" };
}

// Compute Heatmap Risk Zones dynamically from complaint spatial clusters
export function computeHeatmapZones(complaints: Complaint[], baseCenter = { lat: 12.9352, lng: 77.6245 }): DynamicHeatmapZone[] {
  if (!complaints || complaints.length === 0) {
    return [];
  }

  // Map complaints into a normalized 0-100 SVG viewport coordinate space
  return complaints.map((c, idx) => {
    // Generate deterministic relative SVG coordinates from lat/lng offsets
    const latDiff = (c.lat - baseCenter.lat) * 2000;
    const lngDiff = (c.lng - baseCenter.lng) * 2000;

    let cx = 50 + lngDiff;
    let cy = 50 - latDiff;

    // Constrain to SVG boundaries
    cx = Math.max(15, Math.min(85, cx));
    cy = Math.max(15, Math.min(85, cy));

    const sev = c.severity ? c.severity.toLowerCase() : "medium";
    const level: "safe" | "caution" | "danger" =
      sev === "high" || sev === "critical" ? "danger" : sev === "medium" ? "caution" : "safe";

    return {
      id: `zone-${c.id}`,
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
