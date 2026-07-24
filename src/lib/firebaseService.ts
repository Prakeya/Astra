import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  addDoc
} from "firebase/firestore";
import { db, auth, isFirebaseConfigured, ensureAnonymousAuth } from "./firebase";
import {
  Complaint,
  UserProfile,
  GuardianLocation,
  EmergencyAlert,
  IncidentVerification,
  UserLiveLocation,
  VerificationStatus,
  EscalationState
} from "../types/safety";
import {
  getComplaints as getLocalComplaints,
  saveComplaints as saveLocalComplaints
} from "./safetyStore";

// -------------------------------------------------------------
// 1. COMPLAINTS & REAL-TIME LISTENER
// -------------------------------------------------------------

export function subscribeToComplaints(onUpdate: (complaints: Complaint[]) => void): () => void {
  if (isFirebaseConfigured() && db) {
    try {
      const complaintsCol = collection(db, "complaints");
      const q = query(complaintsCol, orderBy("timestamp", "desc"), limit(100));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const complaints: Complaint[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as any;
            complaints.push({
              id: doc.id,
              type: data.type || "general",
              label: data.label || "Community Incident",
              severity: data.severity || "Medium",
              description: data.description || "",
              anonymous: Boolean(data.anonymous),
              timestamp: data.timestamp || new Date().toISOString(),
              lat: Number(data.lat) || 0,
              lng: Number(data.lng) || 0,
              locationName: data.locationName || "Unknown Location",
              imageUrl: data.imageUrl,
              status: data.status || "Reported",
              count: data.count || 1,
              isSos: Boolean(data.isSos),
              reporterId: data.reporterId || "anonymous",
              trustScore: typeof data.trustScore === "number" ? data.trustScore : 50,
              confirmationsCount: data.confirmationsCount || 0,
              falseReportsCount: data.falseReportsCount || 0,
              verificationStatus: (data.verificationStatus as VerificationStatus) || "pending",
              escalationState: (data.escalationState as EscalationState) || "none",
              isEmergency: Boolean(data.isEmergency),
              geminiConfidence: data.geminiConfidence || data.aiAnalysis?.confidenceScore || 0.9,
              geminiReasoning: data.geminiReasoning || data.aiAnalysis?.reasoning,
              assignedGuardianId: data.assignedGuardianId,
              assignedGuardianName: data.assignedGuardianName,
              assignedGuardianEta: data.assignedGuardianEta,
              aiAnalysis: data.aiAnalysis,
            });
          });

          // Also keep local storage in sync so offline components work
          if (complaints.length > 0) {
            saveLocalComplaints(complaints);
          }
          onUpdate(complaints);
        },
        (error) => {
          console.warn("Firestore complaints snapshot listener error, falling back to local storage:", error);
          onUpdate(getLocalComplaints());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Failed to subscribe to Firestore complaints:", err);
    }
  }

  // Fallback to local storage event listener
  const handleLocalUpdate = () => {
    onUpdate(getLocalComplaints());
  };
  window.addEventListener("astra_complaints_updated", handleLocalUpdate);
  // Initial fire
  onUpdate(getLocalComplaints());

  return () => {
    window.removeEventListener("astra_complaints_updated", handleLocalUpdate);
  };
}

// Add Complaint with Firestore sync and automated emergency escalation
export async function createComplaintService(complaintData: {
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
  const user = auth?.currentUser || (await ensureAnonymousAuth());
  const uid = user ? user.uid : `anon-${Date.now()}`;

  const isHighOrCritical = complaintData.severity === "High" || complaintData.severity === "Critical" || Boolean(complaintData.isSos);
  const initialStatus = isHighOrCritical ? "Guardian Alerted" : "Reported";
  const initialEscalation: EscalationState = isHighOrCritical ? "escalated" : "none";

  const id = `report-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newComplaint: Complaint = {
    id,
    type: complaintData.type,
    label: complaintData.label,
    severity: complaintData.severity,
    description: complaintData.description,
    anonymous: complaintData.anonymous,
    timestamp: nowStr,
    lat: complaintData.lat,
    lng: complaintData.lng,
    locationName: complaintData.locationName,
    imageUrl: complaintData.imageUrl,
    status: initialStatus,
    count: 1,
    isSos: Boolean(complaintData.isSos),
    reporterId: uid,
    trustScore: isHighOrCritical ? 75 : 50,
    confirmationsCount: 1, // Self verified by submitter
    falseReportsCount: 0,
    verificationStatus: isHighOrCritical ? "verified" : "pending",
    escalationState: initialEscalation,
    isEmergency: isHighOrCritical,
  };

  // 1. Save to local storage immediately
  const localList = getLocalComplaints();
  saveLocalComplaints([newComplaint, ...localList]);

  // 2. Save to Firestore if configured
  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "complaints", id), {
        ...newComplaint,
        createdAt: serverTimestamp(),
      });

      // 3. Automated Emergency Escalation
      if (isHighOrCritical) {
        await triggerEmergencyEscalationFirestore(newComplaint);
      }
    } catch (err) {
      console.warn("Firestore save complaint failed, retained locally:", err);
    }
  }

  // 4. Trigger Gemini AI Analysis
  analyzeComplaintAndSync(id, newComplaint);

  return newComplaint;
}

// Asynchronous Gemini AI analysis pipeline
async function analyzeComplaintAndSync(id: string, complaint: Complaint) {
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
      const aiAnalysis = await response.json();
      const current = getLocalComplaints();
      const idx = current.findIndex((c) => c.id === id);

      const isHigh = aiAnalysis.severity === "High" || aiAnalysis.severity === "Critical" || complaint.isSos;

      if (idx !== -1) {
        current[idx].aiAnalysis = aiAnalysis;
        current[idx].geminiConfidence = aiAnalysis.confidenceScore || 0.92;
        current[idx].geminiReasoning = aiAnalysis.reasoning;
        current[idx].status = "Analyzed by AI";
        if (aiAnalysis.severity) {
          current[idx].severity = aiAnalysis.severity;
        }
        if (isHigh) {
          current[idx].isEmergency = true;
          current[idx].escalationState = "escalated";
          current[idx].status = "Guardian Alerted";
        }
        saveLocalComplaints(current);
      }

      // Sync AI analysis result to Firestore
      if (isFirebaseConfigured() && db) {
        await updateDoc(doc(db, "complaints", id), {
          aiAnalysis,
          geminiConfidence: aiAnalysis.confidenceScore || 0.92,
          geminiReasoning: aiAnalysis.reasoning,
          severity: aiAnalysis.severity || complaint.severity,
          status: isHigh ? "Guardian Alerted" : "Analyzed by AI",
          isEmergency: isHigh,
          escalationState: isHigh ? "escalated" : "none",
        });

        if (isHigh) {
          await triggerEmergencyEscalationFirestore({
            ...complaint,
            aiAnalysis,
            severity: aiAnalysis.severity || complaint.severity
          });
        }
      }
    }
  } catch (err) {
    console.warn("Gemini async analysis sync offline:", err);
  }
}

// -------------------------------------------------------------
// 2. TRUST-BASED INCIDENT VERIFICATION
// -------------------------------------------------------------

export async function verifyIncidentService(
  complaintId: string,
  type: "confirm" | "false_alarm"
): Promise<{ newTrustScore: number; status: VerificationStatus }> {
  const user = auth?.currentUser || (await ensureAnonymousAuth());
  const uid = user ? user.uid : `anon-voter-${Date.now()}`;

  const currentList = getLocalComplaints();
  const idx = currentList.findIndex((c) => c.id === complaintId);

  if (idx === -1) {
    return { newTrustScore: 50, status: "pending" };
  }

  const target = currentList[idx];
  let confirms = (target.confirmationsCount || 0) + (type === "confirm" ? 1 : 0);
  let falseReports = (target.falseReportsCount || 0) + (type === "false_alarm" ? 1 : 0);

  // Dynamic Trust Score Formula
  const totalVotes = confirms + falseReports;
  let newTrustScore = Math.round((confirms / totalVotes) * 100);
  if (totalVotes < 2) {
    newTrustScore = Math.round((confirms / (totalVotes + 1)) * 90);
  }

  let status: VerificationStatus = "pending";
  if (falseReports > confirms) {
    status = "rejected";
  } else if (confirms >= 2 && newTrustScore >= 65) {
    status = "verified";
  }

  // Update local storage
  target.confirmationsCount = confirms;
  target.falseReportsCount = falseReports;
  target.trustScore = newTrustScore;
  target.verificationStatus = status;
  saveLocalComplaints(currentList);

  // Sync to Firestore
  if (isFirebaseConfigured() && db) {
    try {
      await updateDoc(doc(db, "complaints", complaintId), {
        confirmationsCount: confirms,
        falseReportsCount: falseReports,
        trustScore: newTrustScore,
        verificationStatus: status,
      });

      // Audit trail record
      await addDoc(collection(db, "verifications"), {
        complaintId,
        userId: uid,
        type,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Firestore verification record sync error:", err);
    }
  }

  return { newTrustScore, status };
}

// -------------------------------------------------------------
// 3. AUTOMATED EMERGENCY ESCALATION
// -------------------------------------------------------------

export async function triggerEmergencyEscalationFirestore(complaint: Complaint) {
  if (!isFirebaseConfigured() || !db) return;

  try {
    let closestGuardian: GuardianLocation | null = null;
    let minDistance = Infinity;
    let activeGuardiansCount = 0;

    try {
      const guardiansSnap = await getDocs(query(collection(db, "guardians"), where("available", "==", true)));
      activeGuardiansCount = guardiansSnap.size;

      guardiansSnap.forEach((doc) => {
        const g = doc.data() as GuardianLocation;
        if (g.lat && g.lng) {
          // Euclidean distance estimation (approx 1 deg ~ 111 km)
          const dist = Math.hypot(g.lat - complaint.lat, g.lng - complaint.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestGuardian = g;
          }
        }
      });
    } catch (gErr) {
      console.warn("Guardian lookup error during escalation:", gErr);
    }

    const assignedName = closestGuardian ? closestGuardian.displayName : "Patrol Unit Alpha";
    const assignedId = closestGuardian ? closestGuardian.uid : "g-1";
    const calculatedEta = closestGuardian && minDistance !== Infinity
      ? `${Math.max(1, Math.round(minDistance * 111 * 2))} min`
      : "2 min";

    const alertRef = doc(db, "emergencies", `emerg-${complaint.id}`);
    await setDoc(alertRef, {
      id: `emerg-${complaint.id}`,
      complaintId: complaint.id,
      severity: complaint.severity,
      locationName: complaint.locationName,
      lat: complaint.lat,
      lng: complaint.lng,
      timestamp: new Date().toISOString(),
      status: "escalated",
      assignedGuardianId: assignedId,
      assignedGuardianName: assignedName,
      assignedGuardianEta: calculatedEta,
      notifiedGuardiansCount: Math.max(1, activeGuardiansCount),
      summary: complaint.description,
      aiReasoning: complaint.geminiReasoning || complaint.aiAnalysis?.summary || "Automated escalation triggered by high threat classification."
    });

    // Update complaint record in Firestore with assigned guardian details
    await updateDoc(doc(db, "complaints", complaint.id), {
      assignedGuardianId: assignedId,
      assignedGuardianName: assignedName,
      assignedGuardianEta: calculatedEta,
      status: "Guardian Alerted",
      escalationState: "escalated",
      isEmergency: true
    });

    // Update local storage record if present
    const local = getLocalComplaints();
    const idx = local.findIndex(c => c.id === complaint.id);
    if (idx !== -1) {
      local[idx].assignedGuardianId = assignedId;
      local[idx].assignedGuardianName = assignedName;
      local[idx].assignedGuardianEta = calculatedEta;
      local[idx].status = "Guardian Alerted";
      local[idx].escalationState = "escalated";
      local[idx].isEmergency = true;
      saveLocalComplaints(local);
    }
  } catch (err) {
    console.warn("Emergency alert escalation record creation error:", err);
  }
}

export function subscribeToEmergencyAlerts(onUpdate: (alerts: EmergencyAlert[]) => void): () => void {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "emergencies"), where("status", "==", "escalated"));
      return onSnapshot(
        q,
        (snapshot) => {
          const alerts: EmergencyAlert[] = [];
          snapshot.forEach((doc) => {
            alerts.push(doc.data() as EmergencyAlert);
          });
          onUpdate(alerts);
        },
        (err) => {
          console.warn("Emergency alerts subscription offline:", err);
          onUpdate([]);
        }
      );
    } catch (e) {
      console.warn("Emergency alerts setup error:", e);
    }
  }
  onUpdate([]);
  return () => {};
}

// -------------------------------------------------------------
// 4. REAL-TIME LOCATION SHARING
// -------------------------------------------------------------

export async function updateUserLocationService(lat: number, lng: number, sharingEnabled: boolean) {
  const user = auth?.currentUser || (await ensureAnonymousAuth());
  const uid = user ? user.uid : "anon-local-user";

  const locData: UserLiveLocation = {
    uid,
    displayName: user?.isAnonymous ? "Community Member" : user?.displayName || "Verified Member",
    lat,
    lng,
    sharingEnabled,
    lastUpdated: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "users", uid, "location", "current"), locData, { merge: true });
    } catch (err) {
      console.warn("Location sharing Firestore sync failed:", err);
    }
  }
}

export function subscribeToLiveUserLocations(onUpdate: (locations: UserLiveLocation[]) => void): () => void {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "users"));
      return onSnapshot(q, (snapshot) => {
        const locations: UserLiveLocation[] = [];
        snapshot.forEach((userDoc) => {
          const data = userDoc.data();
          if (data.lastLat && data.lastLng && data.locationSharingEnabled) {
            locations.push({
              uid: userDoc.id,
              displayName: data.displayName || "Active Walk Member",
              lat: data.lastLat,
              lng: data.lastLng,
              sharingEnabled: true,
              lastUpdated: data.lastUpdated || new Date().toISOString()
            });
          }
        });
        onUpdate(locations);
      });
    } catch (err) {
      console.warn("User locations snapshot failed:", err);
    }
  }
  onUpdate([]);
  return () => {};
}

// -------------------------------------------------------------
// 5. COMMUNITY GUARDIAN MATCHING
// -------------------------------------------------------------

export async function toggleGuardianStatusService(
  enabled: boolean,
  lat: number,
  lng: number,
  radiusKm = 2.5
): Promise<GuardianLocation | null> {
  const user = auth?.currentUser || (await ensureAnonymousAuth());
  const uid = user ? user.uid : `guardian-${Date.now()}`;

  const guardian: GuardianLocation = {
    uid,
    displayName: "Community Guardian Unit",
    lat,
    lng,
    available: enabled,
    radiusKm,
    lastUpdated: new Date().toISOString(),
    trustRating: 4.9,
  };

  if (isFirebaseConfigured() && db) {
    try {
      await setDoc(doc(db, "guardians", uid), guardian);
      await setDoc(
        doc(db, "users", uid),
        { guardianEnabled: enabled, guardianRadiusKm: radiusKm, guardianStatus: enabled ? "available" : "offline" },
        { merge: true }
      );
    } catch (err) {
      console.warn("Guardian mode toggle Firestore sync error:", err);
    }
  }

  return guardian;
}

export function subscribeToGuardians(onUpdate: (guardians: GuardianLocation[]) => void): () => void {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, "guardians"), where("available", "==", true));
      return onSnapshot(q, (snapshot) => {
        const list: GuardianLocation[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as GuardianLocation);
        });
        onUpdate(list);
      });
    } catch (err) {
      console.warn("Guardian snapshot error:", err);
    }
  }

  // Fallback demo guardians around center
  const demoGuardians: GuardianLocation[] = [
    {
      uid: "g-1",
      displayName: "Patrol Unit Alpha",
      lat: 11.128,
      lng: 78.658,
      available: true,
      radiusKm: 3.0,
      lastUpdated: "Just now",
      trustRating: 4.9
    },
    {
      uid: "g-2",
      displayName: "Safe Haven Station 4",
      lat: 11.126,
      lng: 78.655,
      available: true,
      radiusKm: 2.0,
      lastUpdated: "2m ago",
      trustRating: 5.0
    }
  ];
  onUpdate(demoGuardians);
  return () => {};
}
