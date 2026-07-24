export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";

export interface AIAnalysis {
  category: string;
  severity: SeverityLevel;
  threatLevel: SeverityLevel;
  confidenceScore?: number;
  extractedLocation?: string;
  extractedTime?: string;
  riskIndicators?: string[];
  suggestedSafetyAdvice?: string;
  recommendedAction: string;
  reasoning?: string;
  safetyImpactScore: number;
  summary: string;
}

export type VerificationStatus = "verified" | "pending" | "rejected";

export type EscalationState = "none" | "escalated" | "resolved";

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

export interface SafetyScoreResult {
  score: number;
  label: string;
  status: "optimal" | "moderate" | "caution" | "critical";
  explanations: string[];
  stats: {
    totalComplaints: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    nighttimeCount: number;
    mostCommonCategory: string;
    highestRiskLocation: string;
    safestLocation: string;
    peakRiskHour: string;
  };
}

export interface HotspotDetail {
  id: string;
  areaName: string;
  safetyScore: number;
  complaintCount: number;
  mostCommonIncident: string;
  averageSeverity: SeverityLevel;
  mostRecentComplaint: string;
  recommendedPrecautions: string;
  riskIndicators: string[];
  nearbyFacilities: { name: string; distance: string; type: string }[];
}

export interface Complaint {
  id: string;
  type: string;
  label: string;
  severity: SeverityLevel;
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
  
  // Extended Resume & Firebase Features
  reporterId?: string;
  trustScore?: number; // 0 to 100
  confirmationsCount?: number;
  falseReportsCount?: number;
  verificationStatus?: VerificationStatus;
  escalationState?: EscalationState;
  isEmergency?: boolean;
  geminiConfidence?: number;
  geminiReasoning?: string;
  assignedGuardianId?: string;
  assignedGuardianName?: string;
  assignedGuardianEta?: string;
  createdAt?: string;
}

export interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  isAnonymous: boolean;
  guardianEnabled: boolean;
  guardianRadiusKm: number;
  guardianStatus: "available" | "busy" | "offline";
  locationSharingEnabled: boolean;
  lastLat?: number;
  lastLng?: number;
  lastUpdated?: string;
}

export interface GuardianLocation {
  uid: string;
  displayName: string;
  lat: number;
  lng: number;
  available: boolean;
  radiusKm: number;
  lastUpdated: string;
  phoneNumber?: string;
  trustRating?: number;
}

export interface EmergencyAlert {
  id: string;
  complaintId: string;
  severity: SeverityLevel;
  locationName: string;
  lat: number;
  lng: number;
  timestamp: string;
  status: "active" | "escalated" | "resolved";
  notifiedGuardiansCount: number;
  assignedGuardianId?: string;
  assignedGuardianName?: string;
  assignedGuardianEta?: string;
  summary: string;
  aiReasoning?: string;
}

export interface IncidentVerification {
  id: string;
  complaintId: string;
  userId: string;
  type: "confirm" | "false_alarm";
  timestamp: string;
}

export interface UserLiveLocation {
  uid: string;
  displayName?: string;
  lat: number;
  lng: number;
  sharingEnabled: boolean;
  lastUpdated: string;
}
