import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { MapBackground } from "@/components/MapBackground";
import { SOSButton } from "@/components/SOSButton";
import { ZONES, LEVEL_COLOR, type Zone } from "@/lib/safetyData";
import { StarryBackground } from "@/components/StarryBackground";
import {
  ArrowLeft, Navigation, AlertTriangle, CheckCircle,
  Shield, Clock, Zap, MapPin, CheckCircle2, ShieldCheck, Compass, Info, Users,
  ArrowUp, ArrowUpRight
} from "lucide-react";

const ENCOURAGEMENTS = [
  "Astra active — you are accompanied every step.",
  "Maintaining visual perimeter security — proceed forward.",
  "Nearing destination securely.",
  "Secure zone arrival confirmed.",
];

function getRouteZones(dest: string): Zone[] {
  const d = dest.toLowerCase();
  if (!d) return [];
  const ROUTE_MAP: Record<string, string[]> = {
    college:  ["z1", "z3", "z4"],
    office:   ["z2", "z3", "z6"],
    metro:    ["z1", "z3"],
    station:  ["z1", "z3"],
    mall:     ["z3", "z6"],
    hospital: ["z3", "z7"],
    home:     ["z5", "z3"],
    park:     ["z2", "z3"],
    library:  ["z3", "z4"],
  };
  for (const [key, ids] of Object.entries(ROUTE_MAP)) {
    if (d.includes(key)) {
      return ids.map(id => ZONES.find(z => z.id === id)!).filter(Boolean);
    }
  }
  return [ZONES[2], ZONES[5]];
}

function getWalkAlerts(zones: Zone[]): { trigger: number; zone: Zone }[] {
  const dangerZones = zones.filter(z => z.level === "danger");
  const cautionZones = zones.filter(z => z.level === "caution");
  const alerts: { trigger: number; zone: Zone }[] = [];
  if (dangerZones[0]) alerts.push({ trigger: 18, zone: dangerZones[0] });
  if (cautionZones[0]) alerts.push({ trigger: 38, zone: cautionZones[0] });
  if (dangerZones[1]) alerts.push({ trigger: 55, zone: dangerZones[1] });
  return alerts;
}

type Screen = "setup" | "walking" | "arrived";

const LEVEL_LABEL = { safe: "Safe", caution: "Caution", danger: "Alert" };
const LEVEL_ICON = {
  safe: <CheckCircle size={11} />,
  caution: <Info size={11} />,
  danger: <AlertTriangle size={11} />,
};

export function WalkMode() {
  const [, setLocation] = useLocation();
  const [screen, setScreen] = useState<Screen>("setup");
  const [routePreference, setRoutePreference] = useState<"safe" | "shortest">("safe");
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [destErr, setDestErr] = useState("");
  const [originErr, setOriginErr] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [distCovered, setDistCovered] = useState(0);

  // Dynamic distance calculation based on typed values
  const [shortestDistance, safeDistance] = useMemo(() => {
    if (!origin.trim() || !destination.trim()) return [1.1, 1.6];
    
    const hash = (str: string) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
      }
      return Math.abs(h);
    };
    
    const combinedHash = hash(origin.trim() + destination.trim());
    const base = (combinedHash % 32) / 10 + 0.9; // 0.9 to 4.0 KM
    const extraForSafe = 0.4 + (hash(destination) % 6) / 10; // 0.4 to 0.9 KM detour
    return [
      parseFloat(base.toFixed(1)),
      parseFloat((base + extraForSafe).toFixed(1))
    ];
  }, [origin, destination]);

  const totalDist = routePreference === "safe" ? safeDistance : shortestDistance;

  const [zoneAlert, setZoneAlert] = useState<Zone | null>(null);
  const [rerouted, setRerouted] = useState(false);
  const [passedZones, setPassedZones] = useState<Zone[]>([]);
  const [walkStart, setWalkStart] = useState<Date | null>(null);
  const [encourageMsg] = useState(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const firedAlerts = useRef<Set<number>>(new Set());

  // Dynamic user-requested popups while walking
  const [showDimLightsPopup, setShowDimLightsPopup] = useState(false);
  const [showCoWalkerPopup, setShowCoWalkerPopup] = useState(false);
  const [coWalkerPaired, setCoWalkerPaired] = useState(false);

  // Motion telemetry and Route Input Overlay Modal states
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [showRouteModal, setShowRouteModal] = useState(false);

  // Safest Route mapping service query states
  const [isQuerying, setIsQuerying] = useState(false);
  const [safetyMetrics, setSafetyMetrics] = useState<{
    safe: { lighting: string; population: string; incidents: string; description: string };
    shortest: { lighting: string; population: string; incidents: string; description: string };
  } | null>(null);

  // Geolocation real-time physical motion tracker states
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [useRealGPS, setUseRealGPS] = useState(false);
  const [simStepOffset, setSimStepOffset] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  const querySafestRoute = async (from: string, to: string) => {
    if (!from.trim() || !to.trim()) return;
    setIsQuerying(true);
    // Simulate real-time API query to Astra safety routing database & Google Directions service
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Hash-based metrics generator so different locations return slightly different high-fidelity values
    const seed = from.length + to.length;
    const safeLighting = 92 + (seed % 8); // 92% - 99%
    const shortestLighting = 32 + (seed % 14); // 32% - 45%
    
    setSafetyMetrics({
      safe: {
        lighting: `${safeLighting}% Smart LED Illumination`,
        population: "High Density (Active storefront corridor & foot traffic)",
        incidents: "0 incidents reported in past 24 months",
        description: `Bypasses dim underpass and empty alleys. Reroutes through ${safeLighting}% fully lit, citizen-patrolled main lanes.`
      },
      shortest: {
        lighting: `${shortestLighting}% Standard Lighting`,
        population: "Low Density (Industrial warehouse & back alley lanes)",
        incidents: `${(seed % 3) + 2} warnings recorded (recent theft & poor visibility)`,
        description: "Direct shortest route but includes poorly illuminated shortcuts with active caution flags."
      }
    });
    setIsQuerying(false);
  };

  useEffect(() => {
    if (origin.trim() && destination.trim()) {
      querySafestRoute(origin, destination);
    } else {
      setSafetyMetrics(null);
    }
  }, [origin, destination]);

  // Live Geolocation API tracking and motion simulation
  useEffect(() => {
    if (screen !== "walking") {
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        setGpsWatchId(null);
      }
      return;
    }

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsAccuracy(accuracy);
        
        // Feed real GPS coordinates combined with simulated physical steps for testing inside stagnant locations
        setGeoCoords({
          lat: latitude + simStepOffset.lat,
          lng: longitude + simStepOffset.lng,
        });
      },
      (error) => {
        console.warn("Geolocation watch error:", error.message);
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    );

    setGpsWatchId(watchId);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [screen, simStepOffset]);

  const liveMapLocation = useMemo(() => {
    if (useRealGPS && geoCoords) {
      return geoCoords;
    }
    return null;
  }, [useRealGPS, geoCoords]);

  const handleSimulatePhysicalStep = () => {
    // Increment coordinates towards the destination (roughly North-East direction)
    setSimStepOffset((prev) => ({
      lat: prev.lat + 0.00015,
      lng: prev.lng + 0.00015,
    }));
  };

  const routeZones = useMemo(() => {
    const rawZones = getRouteZones(destination);
    if (routePreference === "safe") {
      // Simulate bypassing danger sectors by converting approach zones to secure patrolled pathways
      return rawZones.map(z => z.level === "danger" ? { 
        ...z, 
        level: "safe" as const, 
        label: z.label + " Bypass", 
        desc: "Astra routed you via well-lit main avenue with active safety patrols.", 
        incidents: 0 
      } : z);
    }
    return rawZones;
  }, [destination, routePreference]);
  const walkAlerts = useMemo(() => getWalkAlerts(routeZones), [routeZones]);
  const routeDanger = routeZones.filter(z => z.level === "danger");
  const routeCaution = routeZones.filter(z => z.level === "caution");
  const routeSafe = routeZones.filter(z => z.level === "safe");

  const startWalk = () => {
    if (!origin.trim() || !destination.trim()) {
      setShowRouteModal(true);
      return;
    }
    setScreen("walking");
    setWalkStart(new Date());
    setElapsed(0);
    setDistCovered(0);
    setPassedZones([]);
    firedAlerts.current = new Set();
    setShowDimLightsPopup(false);
    setShowCoWalkerPopup(false);
    setCoWalkerPaired(false);
  };

  useEffect(() => {
    if (screen !== "walking") return;
    tickRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + simSpeed;
        setDistCovered(Math.min((next / 120) * totalDist, totalDist)); // Accelerated timeline for demo
        for (const alert of walkAlerts) {
          if (e < alert.trigger && next >= alert.trigger && !firedAlerts.current.has(alert.trigger) && !rerouted) {
            firedAlerts.current.add(alert.trigger);
            setZoneAlert(alert.zone);
          }
        }
        
        // Trigger Dim Lights alert popup
        if (e < 15 && next >= 15) {
          setShowDimLightsPopup(true);
        }

        // Trigger Co-Walker matching popup
        if (e < 35 && next >= 35) {
          setShowCoWalkerPopup(true);
        }

        const pct = next / 120;
        const zonesToPass = routeZones.filter((_, i) =>
          pct >= (i + 1) / (routeZones.length + 1) - 0.05
        );
        setPassedZones(zonesToPass);
        if (next >= 120) {
          if (tickRef.current) clearInterval(tickRef.current);
          setScreen("arrived");
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [screen, rerouted, totalDist, walkAlerts, routeZones, simSpeed]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const etaMins = Math.max(0, Math.ceil((120 - elapsed) / 10)); // Adjusted to match simulation
  const pct = Math.min((distCovered / totalDist) * 100, 100);
  const arrivalTime = walkStart ? new Date(walkStart.getTime() + elapsed * 1000) : new Date();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-[#e0f2fe] text-[#083344]">
      {/* Cinematic Dreamscape Backdrop */}
      <StarryBackground />

      <AnimatePresence mode="wait">
        {/* ── SETUP SCREEN ── */}
        {screen === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-y-auto relative z-10 pb-28">
            <MapBackground active={origin.trim().length > 0 && destination.trim().length > 0} progress={0} routePreference={routePreference} />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#e0f2fe]/90 via-[#e0f2fe]/45 to-[#e0f2fe]/95" />

            <div className="relative z-20 flex flex-col h-full px-5">
              <div className="pt-14 pb-4">
                <button onClick={() => setLocation("/home")} className="flex items-center gap-2 text-[#085a70]/80 hover:text-[#083344] text-xs font-black uppercase tracking-widest transition-colors">
                  <ArrowLeft size={13} className="stroke-[3]" /> Back
                </button>
              </div>

              <div className="mt-2 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-3 shadow-md border border-cyan-400/20">
                  <Compass size={22} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-[#083344] tracking-tight uppercase font-sans">Plan Route</h1>
                <p className="text-xs text-[#0f766e] font-bold mt-1">Astra analyzes active heatmap zones to secure your walk</p>
              </div>

              {/* Input card */}
              <div className="rounded-3xl border border-[#085a70]/10 overflow-hidden mb-4 bg-white/55 backdrop-blur-md shadow-sm">
                <div className="p-4 border-b border-[#085a70]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0d9488] shrink-0" />
                    <input value={origin} onChange={e => { setOrigin(e.target.value); setOriginErr(""); }}
                      placeholder="Starting point (e.g. My home, Library)"
                      className="bg-transparent text-sm text-[#083344] placeholder:text-[#083344]/40 outline-none flex-1 font-sans font-bold" />
                  </div>
                  {originErr && <p className="text-xs text-rose-600 mt-1.5 ml-5 font-bold">{originErr}</p>}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-600 shrink-0" />
                    <input value={destination} onChange={e => { setDestination(e.target.value); setDestErr(""); }}
                      placeholder="Destination (e.g. College, Metro station)"
                      className="bg-transparent text-sm text-[#083344] placeholder:text-[#083344]/40 outline-none flex-1 font-sans font-bold" />
                  </div>
                  {destErr && <p className="text-xs text-rose-600 mt-1.5 ml-5 font-bold">{destErr}</p>}
                </div>
              </div>

              {/* Recent Searches */}
              {(!origin.trim() || !destination.trim()) && (
                <div className="mb-5">
                  <span className="text-[10px] font-black text-[#083344]/60 uppercase tracking-widest block mb-2.5">Recent Searches</span>
                  <div className="flex flex-col gap-2">
                    {[
                      { origin: "Connaught Place", destination: "Rajiv Chowk Metro Stn" },
                      { origin: "Vasant Kunj Hub", destination: "Saket Institutional Area" },
                      { origin: "Phoenix Marketcity", destination: "Viman Nagar Crossing" },
                      { origin: "Salt Lake Gate 1", destination: "Sector V Tech Park" },
                    ].map((item, idx) => (
                      <button key={idx} onClick={() => { setOrigin(item.origin); setDestination(item.destination); setOriginErr(""); setDestErr(""); }}
                        className="w-full text-left p-3.5 rounded-3xl border border-[#085a70]/10 text-xs font-black uppercase tracking-wider text-[#083344] bg-white/45 hover:bg-white/65 transition-all shadow-sm flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-[#083344]/50 font-medium lowercase first-letter:uppercase">from {item.origin}</span>
                          <span className="text-[#083344]">{item.destination}</span>
                        </div>
                        <span className="text-[9px] bg-[#0d9488]/10 text-[#0d9488] font-black px-2 py-0.5 rounded-md border border-[#0d9488]/15">Use</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Astra Safe Route Selection - Real Google Map Experience */}
              {origin.trim().length > 0 && destination.trim().length > 0 && (
                <div className="mb-5 text-left">
                  <span className="text-[10px] font-black text-[#083344]/60 uppercase tracking-widest block mb-3">Google Map Route Options</span>
                  
                  {isQuerying ? (
                    <div className="p-6 bg-[#0d9488]/5 rounded-3xl border border-[#0d9488]/15 flex flex-col items-center justify-center gap-3 text-center mb-4">
                      <div className="w-8 h-8 border-2 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0d9488] animate-pulse">Querying Astra Safety Routing Engine...</p>
                        <p className="text-[9px] text-[#083344]/60 mt-1 uppercase tracking-wider font-bold">Analyzing Lighting, Density, and Crime Databases</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setRoutePreference("safe")}
                          className={`rounded-3xl p-4 border text-left flex flex-col justify-between transition-all relative ${
                            routePreference === "safe"
                              ? "border-[#0d9488] bg-[#0d9488]/10 shadow-sm ring-1 ring-[#0d9488]/50"
                              : "border-[#085a70]/10 bg-white/45 hover:bg-white/60"
                          }`}
                        >
                          {routePreference === "safe" && (
                            <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#0d9488] text-white rounded-full animate-pulse">
                              Astra Pick
                            </span>
                          )}
                          <div>
                            <div className="text-sm font-black font-mono text-[#0d9488]">{safeDistance} KM</div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-[#083344] mt-1">Astra Safe Route</div>
                          </div>
                          
                          {safetyMetrics ? (
                            <div className="mt-3 pt-2.5 border-t border-[#0d9488]/10 flex flex-col gap-1 text-[8px] font-black text-[#0f766e] uppercase tracking-wider">
                              <span className="flex items-center gap-1 text-teal-600">🔆 {safetyMetrics.safe.lighting}</span>
                              <span className="flex items-center gap-1">👥 {safetyMetrics.safe.population}</span>
                              <span className="flex items-center gap-1 text-emerald-600 font-extrabold">🛡️ {safetyMetrics.safe.incidents}</span>
                            </div>
                          ) : (
                            <div className="text-[9px] text-[#0f766e] font-bold mt-2 leading-tight">
                              No danger zones • Well-lit avenues • Active safety patrols
                            </div>
                          )}
                        </button>

                        <button
                          onClick={() => setRoutePreference("shortest")}
                          className={`rounded-3xl p-4 border text-left flex flex-col justify-between transition-all relative ${
                            routePreference === "shortest"
                              ? "border-[#f43f5e] bg-[#f43f5e]/5 shadow-sm ring-1 ring-[#f43f5e]/50"
                              : "border-[#085a70]/10 bg-white/45 hover:bg-white/60"
                          }`}
                        >
                          {routePreference === "shortest" && (
                            <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-rose-500 text-white rounded-full">
                              Shortest
                            </span>
                          )}
                          <div>
                            <div className="text-sm font-black font-mono text-rose-600">{shortestDistance} KM</div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-[#083344] mt-1">Shortest Route</div>
                          </div>
                          
                          {safetyMetrics ? (
                            <div className="mt-3 pt-2.5 border-t border-rose-500/10 flex flex-col gap-1 text-[8px] font-black text-rose-700 uppercase tracking-wider">
                              <span className="flex items-center gap-1 text-amber-600">🌙 {safetyMetrics.shortest.lighting}</span>
                              <span className="flex items-center gap-1">👥 {safetyMetrics.shortest.population}</span>
                              <span className="flex items-center gap-1 text-rose-600 font-extrabold">⚠️ {safetyMetrics.shortest.incidents}</span>
                            </div>
                          ) : (
                            <div className="text-[9px] text-rose-700/80 font-bold mt-2 leading-tight">
                              Standard shortest path • Unlit shortcuts • Alerts active
                            </div>
                          )}
                        </button>
                      </div>

                      {safetyMetrics && (
                        <div className="p-3.5 rounded-2xl bg-white/60 border border-[#085a70]/10 mt-3 text-left">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#083344]/60">Astra Safe-Path Insight</p>
                          <p className="text-[10px] text-[#083344] mt-1 leading-relaxed font-bold">
                            {routePreference === "safe" ? safetyMetrics.safe.description : safetyMetrics.shortest.description}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Immediate Prominent Start Walking button */}
                  <div className="mt-4">
                    <button onClick={startWalk}
                      className="w-full h-14 rounded-full font-black text-white text-xs uppercase tracking-widest shadow-xl active:scale-[0.98] transition-transform border border-teal-500/10 flex items-center justify-center gap-2"
                      style={{ 
                        background: "linear-gradient(135deg, #0d9488, #085a70)",
                        boxShadow: "0 10px 20px -8px rgba(8,90,112,0.35)"
                      }}
                      data-testid="btn-start-walk-immediate"
                    >
                      <Navigation size={14} className="fill-current" />
                      <span>Start Walking ({routePreference === "safe" ? "Astra Safe" : "Shortest"})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── ROUTE SAFETY PREVIEW ── */}
              <AnimatePresence>
                {destination.trim().length > 0 && (
                  <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }} className="mb-5">

                    {routeDanger.length > 0 && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="rounded-3xl px-4 py-3.5 mb-3.5 border border-rose-500/15 flex gap-3 items-start bg-rose-500/5 backdrop-blur-sm text-[#083344]">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-0.5">
                            {routeDanger.length} alert sector{routeDanger.length > 1 ? "s" : ""} detected along route
                          </p>
                          <p className="text-[11px] text-[#083344]/80 leading-relaxed font-semibold">{routeDanger[0].tip}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="rounded-3xl border border-[#085a70]/10 overflow-hidden bg-white/55 backdrop-blur-md shadow-sm">
                      <div className="px-4 py-3 border-b border-[#085a70]/5 flex items-center justify-between bg-white/35">
                        <span className="text-[10px] font-black text-[#083344]/70 uppercase tracking-widest">Heatmap Breakdown</span>
                        <div className="flex gap-1.5">
                          {routeDanger.length > 0 && (
                            <span className="text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-rose-500/10 text-rose-600">{routeDanger.length} Alert</span>
                          )}
                          {routeCaution.length > 0 && (
                            <span className="text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-amber-500/10 text-amber-600">{routeCaution.length} Caution</span>
                          )}
                          {routeSafe.length > 0 && (
                            <span className="text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-teal-500/10 text-teal-600">{routeSafe.length} Safe</span>
                          )}
                        </div>
                      </div>

                      {routeZones.map((zone, i) => (
                        <div key={zone.id}
                          className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-[#085a70]/5">
                          <div className="flex flex-col items-center shrink-0" style={{ width: 20 }}>
                            <div className="w-2.5 h-2.5 rounded-full border-2"
                              style={{ borderColor: LEVEL_COLOR[zone.level], background: `${LEVEL_COLOR[zone.level]}20` }} />
                            {i < routeZones.length - 1 && (
                              <div className="w-px mt-1" style={{ height: 14, background: "#085a70/10" }} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 text-[#083344]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black">{zone.label}</span>
                              <span className="flex items-center gap-0.5 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                style={{ background: `${LEVEL_COLOR[zone.level]}15`, color: LEVEL_COLOR[zone.level] }}>
                                {LEVEL_ICON[zone.level]}
                                <span className="ml-0.5">{LEVEL_LABEL[zone.level]}</span>
                              </span>
                            </div>
                            <p className="text-[10px] text-[#083344]/60 mt-0.5 truncate font-medium">{zone.desc}</p>
                          </div>
                        </div>
                      ))}

                      {routeDanger.length > 0 && (
                        <div className="px-4 py-3.5 border-t border-[#085a70]/5 bg-white/20">
                          <div className="flex items-start gap-2.5">
                            <Shield size={14} className="text-[#0d9488] shrink-0 mt-0.5" />
                            <p className="text-[10px] text-[#0f766e] leading-relaxed font-bold">Astra prompts safe bypass routes prior to crossing alert sectors.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status info pills */}
              <div className="flex gap-2 mb-5">
                {[
                  { icon: <Shield size={14} className="text-[#0d9488]" />, label: "Guardians", sub: "2 nearby" },
                  { icon: <MapPin size={14} className="text-[#0d9488]" />, label: "GPS active", sub: "Live sync" },
                  { icon: <Zap size={14} className="text-[#0d9488]" />, label: "SOS system", sub: "Hold 2s" }
                ].map(c => (
                  <div key={c.label} className="flex-1 rounded-3xl p-3 text-center border border-[#085a70]/10 bg-white/55 backdrop-blur-md shadow-sm">
                    <div className="flex justify-center mb-1">{c.icon}</div>
                    <div className="text-[9px] font-black text-[#083344] uppercase tracking-widest">{c.label}</div>
                    <div className="text-[9px] text-[#083344]/50 font-bold uppercase tracking-wider mt-0.5">{c.sub}</div>
                  </div>
                ))}
              </div>

              {/* Start walking capsule button */}
              <button onClick={startWalk}
                className="w-full h-14 rounded-full font-black text-white text-xs uppercase tracking-widest shadow-lg active:scale-[0.98] transition-transform border border-teal-500/10"
                style={{ 
                  background: "linear-gradient(135deg, #0d9488, #085a70)",
                  boxShadow: "0 10px 20px -8px rgba(8,90,112,0.35)"
                }}
                data-testid="btn-start-walk"
              >
                <Navigation size={13} className="inline mr-1.5 fill-current" />
                <span>Start Walking Securely</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ── WALKING SCREEN ── */}
        {screen === "walking" && (
          <motion.div key="walking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full relative z-10">
            <MapBackground active={true} progress={pct} routePreference={routePreference} liveLocation={liveMapLocation} />
            <div className="absolute inset-0 z-5 bg-[#e0f2fe]/45" />

            <div className="relative z-20 pt-14 px-4 pb-2 bg-gradient-to-b from-white/55 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setLocation("/home")} className="p-2.5 rounded-2xl bg-white/70 border border-[#085a70]/10 shadow-sm hover:bg-white transition-colors">
                  <ArrowLeft size={13} className="text-[#083344] stroke-[3]" />
                </button>
                <div className="text-center">
                  <div className="text-[9px] text-[#083344]/60 uppercase tracking-widest font-black">Transit Route</div>
                  <div className="text-sm font-black text-[#083344] mt-0.5">{destination}</div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0d9488]/15 px-3 py-1.5 rounded-full border border-[#0d9488]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse" />
                  <span className="text-[9px] text-[#0d9488] font-black uppercase tracking-widest">Live</span>
                </div>
              </div>
            </div>

            {/* Live TBT Navigation Guidance Bar */}
            <div className="relative z-20 mx-4 mt-1 mb-2 p-3.5 rounded-3xl bg-slate-900/90 text-white shadow-xl border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0d9488] flex items-center justify-center shrink-0 border border-teal-400/20 shadow-md">
                  {pct < 25 ? (
                    <ArrowUp size={18} className="text-white animate-pulse" />
                  ) : pct >= 25 && pct < 50 ? (
                    <ArrowUpRight size={18} className="text-white animate-pulse" />
                  ) : pct >= 50 && pct < 75 ? (
                    <ArrowUp size={18} className="text-white animate-pulse" />
                  ) : (
                    <CheckCircle size={18} className="text-teal-300 animate-bounce" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[9px] uppercase tracking-widest text-teal-300 font-black">Google Maps Guidance</div>
                  <div className="text-xs font-bold leading-normal truncate mt-0.5">
                    {pct < 25 && `Head straight onto ${origin || "Start corridor"} for ${(totalDist * 0.25).toFixed(2)} KM`}
                    {pct >= 25 && pct < 50 && `Turn right at safe bypass corridor toward illuminated avenue`}
                    {pct >= 50 && pct < 75 && `Continue straight along Main Patrol Avenue`}
                    {pct >= 75 && pct < 100 && `Almost there! Proceed ${(totalDist * 0.1).toFixed(2)} KM to ${destination}`}
                    {pct >= 100 && `Arrived at ${destination}! Safe harbor achieved.`}
                  </div>
                  <p className="text-[10px] text-white/60 font-semibold mt-0.5">
                    {useRealGPS ? `Real-Time GPS Tracking • High Accuracy Watch` : `GPS Accuracy: 3m • Moving at standard walking pace`}
                  </p>
                </div>
              </div>
            </div>

            {/* Speed Simulation & Geolocation Motion Monitor Panel */}
            <div className="relative z-20 mx-4 mb-2 p-3.5 rounded-3xl bg-white/85 border border-[#085a70]/10 backdrop-blur-md shadow-sm">
              <div className="flex flex-col gap-3.5">
                {/* Geolocation Mode Selector */}
                <div className="flex items-center justify-between border-b border-[#085a70]/5 pb-2.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#083344]/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    Tracking Mode
                  </span>
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setUseRealGPS(false)}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                        !useRealGPS ? "bg-[#0d9488] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Simulation Path
                    </button>
                    <button
                      onClick={() => {
                        setUseRealGPS(true);
                        // Trigger initial position fetch immediately
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((pos) => {
                            setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                            setGpsAccuracy(pos.coords.accuracy);
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                        useRealGPS ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                      Real GPS Watch
                    </button>
                  </div>
                </div>

                {!useRealGPS ? (
                  /* Standard Simulation Controls */
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#083344]/50">
                      Auto-Walk Progression Speed
                    </span>
                    <div className="flex items-center gap-1 bg-white/85 p-1 rounded-xl border border-[#085a70]/5">
                      {[
                        { label: "1x Walk", val: 1 },
                        { label: "3x Jog", val: 3 },
                        { label: "8x Run", val: 8 },
                      ].map(sp => (
                        <button
                          key={sp.val}
                          onClick={() => setSimSpeed(sp.val)}
                          className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                            simSpeed === sp.val
                              ? "bg-[#0d9488] text-white shadow-sm"
                              : "text-[#083344]/60 hover:text-[#083344] hover:bg-[#085a70]/5"
                          }`}
                        >
                          {sp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Real Geolocation API Navigation Output */
                  <div className="flex flex-col gap-2.5 bg-slate-950/90 text-white p-3 rounded-2xl border border-white/15">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                        Live Geolocation API Stream
                      </span>
                      <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/25">
                        Accuracy: ±{gpsAccuracy ? gpsAccuracy.toFixed(1) : "2.4"}m
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-left font-mono">
                      <div className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5 text-[9px]">
                        <span className="text-white/50 block font-sans text-[7px] font-bold uppercase">Latitude</span>
                        <span className="text-indigo-200 font-extrabold">{geoCoords?.lat ? geoCoords.lat.toFixed(6) : "Searching..."}</span>
                      </div>
                      <div className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5 text-[9px]">
                        <span className="text-white/50 block font-sans text-[7px] font-bold uppercase">Longitude</span>
                        <span className="text-indigo-200 font-extrabold">{geoCoords?.lng ? geoCoords.lng.toFixed(6) : "Searching..."}</span>
                      </div>
                    </div>

                    {/* Simulation offset generator trigger button */}
                    <button
                      onClick={handleSimulatePhysicalStep}
                      className="w-full h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
                    >
                      <MapPin size={10} className="animate-bounce" />
                      <span>Simulate Physical Step (Walk 15m North-East)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Route progress */}
            <div className="relative z-20 px-4 py-2">
              <div className="relative mb-2 h-4">
                {routeZones.map((zone, i) => {
                  const pos = ((i + 1) / (routeZones.length + 1)) * 100;
                  const passed = passedZones.includes(zone);
                  return (
                    <div key={zone.id} className="absolute -translate-x-1/2 flex flex-col items-center"
                         style={{ left: `${pos}%` }}>
                      <div className="w-2.5 h-2.5 rounded-full border shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                           style={{
                             borderColor: LEVEL_COLOR[zone.level],
                             background: passed ? LEVEL_COLOR[zone.level] : "white",
                           }} />
                    </div>
                  );
                })}
              </div>
              <div className="relative h-2 rounded-full overflow-hidden bg-white/70 border border-[#085a70]/10 shadow-inner">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
                  animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
              </div>
              <div className="flex justify-between mt-1.5 font-mono">
                <span className="text-[9px] text-[#083344]/50 uppercase font-black">{origin || "Start"}</span>
                <span className="text-[9px] text-[#0d9488] font-black">{distCovered.toFixed(2)} / {totalDist} KM</span>
                <span className="text-[9px] text-[#083344]/50 uppercase font-black">{destination}</span>
              </div>
            </div>

            {/* Live metrics */}
            <div className="relative z-20 px-4 py-2">
              <div className="flex gap-2">
                {[
                  { icon: <Clock size={12} className="text-[#0d9488]" />, val: fmt(elapsed), label: "elapsed" },
                  { icon: <Zap size={12} className="text-[#0d9488]" />, val: `${etaMins}m`, label: "ETA" },
                  { icon: <Shield size={12} className="text-[#0d9488]" />, val: "2", label: "guardians" },
                ].map(s => (
                  <div key={s.label} className="flex-1 rounded-3xl px-3.5 py-3 border border-[#085a70]/10 bg-white/55 backdrop-blur-md shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1">
                      {s.icon}
                      <span className="text-[8px] text-[#083344]/60 uppercase font-black tracking-widest">{s.label}</span>
                    </div>
                    <div className="text-xs font-black text-[#083344] font-mono">{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {rerouted && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="relative z-20 mx-4 mt-2 rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-teal-500/20 bg-teal-500/10 backdrop-blur-sm">
                <CheckCircle size={14} className="text-[#0d9488]" />
                <span className="text-xs text-[#0f766e] font-bold">Bypass active — bypassing safety hazard sector</span>
              </motion.div>
            )}

            {coWalkerPaired && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="relative z-20 mx-4 mt-2 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Walking with Pooja V. (Verified member)
                </span>
              </motion.div>
            )}

            <div className="relative z-20 px-4 mt-2 flex flex-col gap-2">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="text-xs px-4 py-2.5 rounded-2xl border border-teal-500/15 flex items-center gap-2.5 bg-white/55 backdrop-blur-md">
                <ShieldCheck size={14} className="text-[#0d9488] shrink-0" />
                <span className="text-[#0f766e] font-black text-[10px] uppercase tracking-widest">Perimeter Verified Secure</span>
              </motion.div>

              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {routeZones.map((zone, i) => {
                  const passed = passedZones.includes(zone);
                  return (
                    <div key={zone.id} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider transition-all"
                         style={{
                           borderColor: passed ? `${LEVEL_COLOR[zone.level]}40` : "#085a70/10",
                           background: passed ? `${LEVEL_COLOR[zone.level]}12` : "rgba(255,255,255,0.45)",
                           color: passed ? LEVEL_COLOR[zone.level] : "#083344",
                         }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: LEVEL_COLOR[zone.level] }} />
                      <span>{zone.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions and SOS */}
            <div className="relative z-20 mt-auto pb-24 px-6 flex flex-col items-center gap-5">
              <div className="flex gap-2.5 w-full">
                <button onClick={() => setScreen("arrived")}
                  className="flex-1 h-12 rounded-full font-black text-[10px] uppercase tracking-widest text-[#0d9488] border border-[#0d9488]/20 bg-white/70 backdrop-blur-md active:scale-[0.98] transition-transform"
                  data-testid="btn-arrived"
                >
                  Arrived Safely
                </button>
                <button className="flex-1 h-12 rounded-full font-black text-[10px] uppercase tracking-widest text-cyan-700 border border-cyan-500/20 bg-white/70 backdrop-blur-md active:scale-[0.98] transition-transform"
                  data-testid="btn-safe"
                >
                  I'm Secure
                </button>
              </div>
              <SOSButton />
            </div>
          </motion.div>
        )}

        {/* ── ARRIVED SCREEN ── */}
        {screen === "arrived" && (
          <motion.div key="arrived" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full items-center justify-center px-6 text-center relative z-10"
            style={{ background: "radial-gradient(circle at center, #f0fdf4 0%, #e0f2fe 100%)" }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0d9488] to-[#085a70] flex items-center justify-center mb-6 shadow-xl border border-teal-400/20"
            >
              <ShieldCheck size={36} className="text-white" />
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-2xl font-black text-[#083344] tracking-wider uppercase font-sans mb-1"
            >
              Journey Secured
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-[#0d9488] font-black text-lg tracking-widest font-mono mb-2"
            >
              {arrivalTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-[#083344]/70 text-xs font-semibold leading-relaxed mb-6 max-w-xs"
            >
              {encourageMsg}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="w-full rounded-3xl border border-[#085a70]/10 divide-y divide-[#085a70]/5 mb-5 bg-white/55 backdrop-blur-md shadow-sm text-[#083344]"
            >
              {[
                { label: "Distance Covered", val: `${distCovered.toFixed(2)} KM` },
                { label: "Transit Duration", val: fmt(elapsed) },
                { label: "Active Guardians", val: "2" },
                { label: "Heatmaps Traversed", val: `${routeZones.length} (${routeDanger.length} avoided)` },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-5 py-3">
                  <span className="text-[10px] text-[#083344]/60 uppercase tracking-widest font-black">{r.label}</span>
                  <span className="text-xs font-black font-mono">{r.val}</span>
                </div>
              ))}
            </motion.div>

            {routeZones.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="w-full rounded-3xl border border-[#085a70]/10 px-4 py-3.5 mb-5 flex justify-around bg-white/55 backdrop-blur-md shadow-sm text-[#083344]"
              >
                {([
                  { level: "safe" as const, count: routeSafe.length },
                  { level: "caution" as const, count: routeCaution.length },
                  { level: "danger" as const, count: routeDanger.length },
                ]).map(({ level, count }) => (
                  <div key={level} className="text-center">
                    <div className="text-base font-black font-mono" style={{ color: LEVEL_COLOR[level] }}>{count}</div>
                    <div className="text-[9px] font-black text-[#083344]/50 uppercase tracking-widest mt-0.5">{level}</div>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-[10px] text-[#0d9488] font-black uppercase tracking-widest mb-6"
            >
              Astra Session Safely Logged
            </motion.p>

            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              onClick={() => setLocation("/home")}
              className="w-full h-14 rounded-full font-black text-white text-xs uppercase tracking-widest shadow-lg border border-teal-500/10"
              style={{ 
                background: "linear-gradient(135deg, #0d9488, #085a70)",
                boxShadow: "0 10px 20px -8px rgba(8,90,112,0.35)"
              }}
              data-testid="btn-done"
            >
              Complete Session
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SAFETY OVERLAY / POPUP ── */}
      <AnimatePresence>
        {zoneAlert && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm p-4">
            <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
              className="w-full max-w-sm rounded-[2.5rem] overflow-hidden bg-white/95 border border-[#085a70]/15 shadow-2xl text-[#083344] mb-8"
            >
              <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-[#085a70]/5"
                   style={{ background: `${LEVEL_COLOR[zoneAlert.level]}12` }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                     style={{ background: `${LEVEL_COLOR[zoneAlert.level]}15`, color: LEVEL_COLOR[zoneAlert.level] }}>
                  {zoneAlert.level === "danger" 
                    ? <AlertTriangle size={18} /> 
                    : <Info size={18} />}
                </div>
                <div>
                  <div className="font-black text-[10px] uppercase tracking-widest text-[#083344]/80">
                    {zoneAlert.level === "danger" ? "Alert Sector Approaching" : "Caution Sector Approaching"}
                  </div>
                  <div className="text-xs font-black" style={{ color: LEVEL_COLOR[zoneAlert.level] }}>
                    {zoneAlert.label}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-[#083344]/80 leading-relaxed mb-3 font-semibold">{zoneAlert.desc}</p>
                <p className="text-xs text-[#0f766e] mb-4 bg-[#0d9488]/5 p-2.5 rounded-2xl border border-[#0d9488]/10 font-bold">Bypass Advice: {zoneAlert.tip}</p>

                {zoneAlert.incidents > 0 && (
                  <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl"
                       style={{ background: `${LEVEL_COLOR[zoneAlert.level]}15`, color: LEVEL_COLOR[zoneAlert.level] }}>
                    <AlertTriangle size={11} />
                    {zoneAlert.incidents} incident{zoneAlert.incidents > 1 ? "s" : ""} reported in this sector
                  </div>
                )}

                <div className="flex gap-2">
                  {zoneAlert.level === "danger" && (
                    <button
                      onClick={() => { setZoneAlert(null); setRerouted(true); }}
                      className="flex-1 h-12 rounded-full font-black text-white text-[10px] uppercase tracking-widest shadow-lg border border-teal-500/10 active:scale-[0.98] transition-transform"
                      style={{ 
                        background: "linear-gradient(135deg, #0d9488, #085a70)",
                        boxShadow: "0 8px 16px -6px rgba(8,90,112,0.3)"
                      }}
                      data-testid="btn-reroute"
                    >
                      Reroute Bypass
                    </button>
                  )}
                  <button
                    onClick={() => setZoneAlert(null)}
                    className="flex-1 h-12 rounded-full font-black text-[#085a70] text-[10px] uppercase tracking-widest border border-[#085a70]/20 bg-white/70 hover:bg-white active:scale-[0.98] transition-transform"
                    data-testid="btn-continue-anyway"
                  >
                    {zoneAlert.level === "danger" ? "Continue" : "Dismiss"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── DIM LIGHTS ALERT POPUP ── */}
        {showDimLightsPopup && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm p-4">
            <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
              className="w-full max-w-sm rounded-[2.5rem] overflow-hidden bg-white/95 border border-amber-500/15 shadow-2xl text-[#083344] mb-8"
            >
              <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-amber-500/5 bg-amber-500/5">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-600">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div className="font-black text-[10px] uppercase tracking-widest text-amber-700">Dim Lights Report</div>
                  <div className="text-xs font-black text-[#083344]">Astra Safety Alert</div>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-[#083344]/80 leading-relaxed mb-3 font-semibold">
                  Astra community members have reported multiple dimly lit or inactive street lamps along your upcoming sector.
                </p>
                <p className="text-xs text-[#0f766e] mb-4 bg-teal-500/5 p-2.5 rounded-2xl border border-teal-500/10 font-bold">
                  Advice: Keep your screen brightness normal or switch to a bypass. Active guardian Ananya is patrolled near the crossing.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => { setShowDimLightsPopup(false); setRerouted(true); }}
                    className="flex-1 h-12 rounded-full font-black text-white text-[10px] uppercase tracking-widest shadow-lg border border-teal-500/10"
                    style={{ background: "linear-gradient(135deg, #0d9488, #085a70)" }}
                  >
                    Bypass Sector
                  </button>
                  <button onClick={() => setShowDimLightsPopup(false)}
                    className="flex-1 h-12 rounded-full font-black text-[#085a70] text-[10px] uppercase tracking-widest border border-[#085a70]/20 bg-white/70 hover:bg-white"
                  >
                    Continue Walk
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── CO-WALKER MATCH POPUP ── */}
        {showCoWalkerPopup && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm p-4">
            <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
              className="w-full max-w-sm rounded-[2.5rem] overflow-hidden bg-white/95 border border-teal-500/15 shadow-2xl text-[#083344] mb-8"
            >
              <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-teal-500/5 bg-teal-500/5">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-teal-500/10 text-[#0d9488]">
                  <Users size={18} />
                </div>
                <div>
                  <div className="font-black text-[10px] uppercase tracking-widest text-[#0d9488]">Nearby Co-Walker</div>
                  <div className="text-xs font-black text-[#083344]">Same Destination Matched</div>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs text-[#083344]/80 leading-relaxed mb-3 font-semibold">
                  Astra matched Pooja V. (Verified Member), who is currently walking to the same destination and is 40 meters behind you.
                </p>
                <p className="text-xs text-[#0f766e] mb-4 bg-teal-500/5 p-2.5 rounded-2xl border border-teal-500/10 font-bold">
                  Would you like to sync walks and proceed as a paired group for safety?
                </p>
                <div className="flex gap-2">
                  <button onClick={() => { setCoWalkerPaired(true); setShowCoWalkerPopup(false); }}
                    className="flex-1 h-12 rounded-full font-black text-white text-[10px] uppercase tracking-widest shadow-lg border border-teal-500/10"
                    style={{ background: "linear-gradient(135deg, #0d9488, #085a70)" }}
                  >
                    Yes, Pair Up
                  </button>
                  <button onClick={() => setShowCoWalkerPopup(false)}
                    className="flex-1 h-12 rounded-full font-black text-rose-600 text-[10px] uppercase tracking-widest border border-rose-500/20 bg-white/70 hover:bg-white"
                  >
                    No, Keep Solo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── ROUTE SPECIFICATION PROMPT MODAL ── */}
        {showRouteModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-[2.5rem] overflow-hidden bg-white/95 border border-[#0d9488]/20 shadow-2xl text-[#083344]"
            >
              <div className="px-5 pt-6 pb-4 bg-gradient-to-br from-[#0d9488]/15 to-[#085a70]/5 border-b border-[#085a70]/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-3 shadow-md border border-cyan-400/20">
                  <Compass size={22} className="text-white animate-spin-slow" />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tight text-[#083344] font-sans">Astra Route Setup</h2>
                <p className="text-[10px] text-[#0f766e] font-bold mt-1 uppercase tracking-wider">Starting and Destination required</p>
              </div>

              <div className="px-5 py-5 flex flex-col gap-4">
                {/* Inputs */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#083344]/60 block mb-1.5 ml-1">Starting Point</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0d9488]" />
                    <input 
                      type="text" 
                      value={origin} 
                      onChange={(e) => { setOrigin(e.target.value); setOriginErr(""); }}
                      placeholder="e.g. Connaught Place"
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[#085a70]/15 bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 text-xs font-semibold placeholder:text-[#083344]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#083344]/60 block mb-1.5 ml-1">Destination</label>
                  <div className="relative">
                    <Navigation size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0d9488] fill-current" />
                    <input 
                      type="text" 
                      value={destination} 
                      onChange={(e) => { setDestination(e.target.value); setDestErr(""); }}
                      placeholder="e.g. Rajiv Chowk Metro Stn"
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[#085a70]/15 bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 text-xs font-semibold placeholder:text-[#083344]/30"
                    />
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#083344]/60 block mb-2 ml-1">Quick Presets</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { from: "College Campus", to: "Metro Station" },
                      { from: "Connaught Place", to: "Rajiv Chowk Metro Stn" },
                    ].map((ps, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => { setOrigin(ps.from); setDestination(ps.to); }}
                        className="p-2.5 rounded-xl border border-[#085a70]/10 text-left bg-white/45 hover:bg-white text-[10px] font-bold truncate transition-colors"
                      >
                        <div className="text-[#083344]/50 text-[8px] font-black uppercase">To {ps.to}</div>
                        <div className="truncate text-[#083344] mt-0.5">{ps.from}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Astra Recommendation Card */}
                {origin.trim() && destination.trim() && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-2xl border border-teal-500/15 bg-teal-500/5 flex gap-2.5 items-start animate-pulse"
                  >
                    <ShieldCheck size={16} className="text-teal-600 shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Astra Recommends safest route</p>
                      <p className="text-[10px] text-[#083344]/80 mt-0.5 leading-relaxed font-bold">
                        Bypasses poorly lit paths. Safe corridor recommended!
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-2.5 mt-2">
                  <button 
                    onClick={() => {
                      if (!origin.trim() || !destination.trim()) return;
                      setShowRouteModal(false);
                      setRoutePreference("safe"); // Recommends safest route!
                      startWalk();
                    }}
                    disabled={!origin.trim() || !destination.trim()}
                    className="flex-1 h-12 rounded-full font-black text-white text-[10px] uppercase tracking-widest shadow-lg border border-teal-500/10 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
                    style={{ 
                      background: "linear-gradient(135deg, #0d9488, #085a70)",
                      boxShadow: "0 8px 16px -6px rgba(8,90,112,0.3)"
                    }}
                  >
                    Confirm & Start Walk
                  </button>
                  <button 
                    onClick={() => setShowRouteModal(false)}
                    className="px-4 h-12 rounded-full font-black text-[#085a70] text-[10px] uppercase tracking-widest border border-[#085a70]/20 bg-white/70 hover:bg-white active:scale-[0.98] transition-transform"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
