import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { MapBackground } from "@/components/MapBackground";
import { SOSButton } from "@/components/SOSButton";
import { ZONES, LEVEL_COLOR, type Zone } from "@/lib/safetyData";
import {
  ArrowLeft, Navigation, AlertTriangle, CheckCircle,
  Shield, Clock, Zap, MapPin, ChevronRight, Info, Star
} from "lucide-react";

const ENCOURAGEMENTS = [
  "You've got this, Astra's with you every step 💪",
  "Staying alert — you're doing amazing 🌟",
  "Almost there! Keep going, you're safe 🛡️",
  "Astra is proud of you. Well done! ✨",
  "Home safe — told you Astra would take care of you 😊",
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
  safe: <CheckCircle size={12} />,
  caution: <Info size={12} />,
  danger: <AlertTriangle size={12} />,
};

export function WalkMode() {
  const [, setLocation] = useLocation();
  const [screen, setScreen] = useState<Screen>("setup");
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [destErr, setDestErr] = useState("");
  const [originErr, setOriginErr] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [distCovered, setDistCovered] = useState(0);
  const [totalDist] = useState(1.4);
  const [zoneAlert, setZoneAlert] = useState<Zone | null>(null);
  const [rerouted, setRerouted] = useState(false);
  const [passedZones, setPassedZones] = useState<Zone[]>([]);
  const [walkStart, setWalkStart] = useState<Date | null>(null);
  const [encourageMsg] = useState(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const firedAlerts = useRef<Set<number>>(new Set());

  const routeZones = useMemo(() => getRouteZones(destination), [destination]);
  const walkAlerts = useMemo(() => getWalkAlerts(routeZones), [routeZones]);
  const routeDanger = routeZones.filter(z => z.level === "danger");
  const routeCaution = routeZones.filter(z => z.level === "caution");
  const routeSafe = routeZones.filter(z => z.level === "safe");

  const startWalk = () => {
    if (!origin.trim()) { setOriginErr("Starting point is required"); return; }
    if (!destination.trim()) { setDestErr("Destination is required"); return; }
    setScreen("walking");
    setWalkStart(new Date());
    setElapsed(0);
    setDistCovered(0);
    setPassedZones([]);
    firedAlerts.current = new Set();
  };

  useEffect(() => {
    if (screen !== "walking") return;
    tickRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        setDistCovered(Math.min((next / 540) * totalDist, totalDist));
        for (const alert of walkAlerts) {
          if (next === alert.trigger && !firedAlerts.current.has(alert.trigger) && !rerouted) {
            firedAlerts.current.add(alert.trigger);
            setZoneAlert(alert.zone);
          }
        }
        const pct = next / 540;
        const zonesToPass = routeZones.filter((_, i) =>
          pct >= (i + 1) / (routeZones.length + 1) - 0.05
        );
        setPassedZones(zonesToPass);
        if (next >= 540) {
          if (tickRef.current) clearInterval(tickRef.current);
          setScreen("arrived");
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [screen, rerouted, totalDist, walkAlerts, routeZones]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const etaMins = Math.max(0, Math.ceil((540 - elapsed) / 60));
  const pct = Math.min((distCovered / totalDist) * 100, 100);
  const arrivalTime = walkStart ? new Date(walkStart.getTime() + elapsed * 1000) : new Date();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <AnimatePresence mode="wait">

        {/* ── SETUP SCREEN ── */}
        {screen === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-y-auto">
            <MapBackground />
            <div className="absolute inset-0 z-10" style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.97) 75%)"
            }} />

            <div className="relative z-20 flex flex-col h-full px-5">
              <div className="pt-14 pb-4">
                <button onClick={() => setLocation("/home")} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-medium">
                  <ArrowLeft size={18} /> Back
                </button>
              </div>

              <div className="mt-2 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-3 shadow-lg shadow-rose-200">
                  <Navigation size={22} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Plan your walk</h1>
                <p className="text-sm text-slate-500">Astra checks heatmap zones along your route 🛡️</p>
              </div>

              {/* Input card */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden mb-4 bg-white shadow-sm">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <input value={origin} onChange={e => { setOrigin(e.target.value); setOriginErr(""); }}
                      placeholder="Starting point (e.g. My home, Library)"
                      className="bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none flex-1" />
                  </div>
                  {originErr && <p className="text-xs text-red-500 mt-1.5 ml-5">{originErr}</p>}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <input value={destination} onChange={e => { setDestination(e.target.value); setDestErr(""); }}
                      placeholder="Destination (e.g. College, Metro station)"
                      className="bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none flex-1" />
                  </div>
                  {destErr && <p className="text-xs text-red-500 mt-1.5 ml-5">{destErr}</p>}
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="flex gap-2 mb-5 flex-wrap">
                {["College", "Office", "Metro Station", "Mall", "Hospital"].map(s => (
                  <button key={s} onClick={() => { setDestination(s); setDestErr(""); }}
                    className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-colors font-medium shadow-sm">
                    {s}
                  </button>
                ))}
              </div>

              {/* ── ROUTE SAFETY PREVIEW ── */}
              <AnimatePresence>
                {destination.trim().length > 0 && (
                  <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }} className="mb-5">

                    {routeDanger.length > 0 && (
                      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl px-4 py-3 mb-3 border border-red-200 flex gap-3 items-start bg-red-50">
                        <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-600 mb-0.5">
                            {routeDanger.length} alert zone{routeDanger.length > 1 ? "s" : ""} on this route
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed">{routeDanger[0].tip}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Route Zones</span>
                        <div className="flex gap-1.5">
                          {routeDanger.length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-50 text-red-500">{routeDanger.length} alert</span>
                          )}
                          {routeCaution.length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-600">{routeCaution.length} caution</span>
                          )}
                          {routeSafe.length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-600">{routeSafe.length} safe</span>
                          )}
                        </div>
                      </div>

                      {routeZones.map((zone, i) => (
                        <div key={zone.id}
                          className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-slate-100">
                          <div className="flex flex-col items-center shrink-0" style={{ width: 20 }}>
                            <div className="w-3 h-3 rounded-full border-2"
                              style={{ borderColor: LEVEL_COLOR[zone.level], background: `${LEVEL_COLOR[zone.level]}20` }} />
                            {i < routeZones.length - 1 && (
                              <div className="w-px mt-1" style={{ height: 14, background: "#e2e8f0" }} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-slate-700">{zone.label}</span>
                              <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: `${LEVEL_COLOR[zone.level]}15`, color: LEVEL_COLOR[zone.level] }}>
                                {LEVEL_ICON[zone.level]}
                                {LEVEL_LABEL[zone.level]}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{zone.desc}</p>
                          </div>
                          {zone.level === "danger" && (
                            <ChevronRight size={14} className="text-slate-300 shrink-0" />
                          )}
                        </div>
                      ))}

                      {routeDanger.length > 0 && (
                        <div className="px-4 py-3 border-t border-slate-100 bg-emerald-50/50">
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-emerald-500 shrink-0" />
                            <p className="text-xs text-emerald-700 font-medium">Astra will alert you before entering any red zone and offer to reroute.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info cards */}
              <div className="flex gap-3 mb-5">
                {[{ icon: "🛡️", label: "2 Guardians", sub: "active nearby" },
                  { icon: "📍", label: "GPS Active", sub: "location shared" },
                  { icon: "🔔", label: "SOS Ready", sub: "hold 2s" }].map(c => (
                  <div key={c.label} className="flex-1 rounded-2xl p-3 text-center border border-slate-200 bg-white shadow-sm">
                    <div className="text-xl mb-1">{c.icon}</div>
                    <div className="text-xs font-semibold text-slate-700">{c.label}</div>
                    <div className="text-[10px] text-slate-400">{c.sub}</div>
                  </div>
                ))}
              </div>

              <button onClick={startWalk}
                className="w-full h-14 rounded-2xl font-bold text-white text-base shadow-lg shadow-rose-200 flex items-center justify-center gap-2 mb-8"
                style={{ background: "linear-gradient(135deg, #f43e5c, #e11d48)" }}
                data-testid="btn-start-walk">
                <Navigation size={20} /> Start Walking
              </button>
            </div>
          </motion.div>
        )}

        {/* ── WALKING SCREEN ── */}
        {screen === "walking" && (
          <motion.div key="walking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full">
            <MapBackground active={true} />
            <div className="absolute inset-0 z-5" style={{ background: "rgba(255,255,255,0.4)" }} />

            <div className="relative z-20 pt-14 px-4 pb-3"
                 style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.97), transparent)" }}>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setLocation("/home")} className="p-2 rounded-xl bg-white shadow-sm border border-slate-200">
                  <ArrowLeft size={18} className="text-slate-600" />
                </button>
                <div className="text-center">
                  <div className="text-xs text-slate-500 font-medium">Walking to</div>
                  <div className="text-sm font-bold text-slate-800">{destination}</div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-600 font-semibold">Live</span>
                </div>
              </div>
            </div>

            {/* Route progress */}
            <div className="relative z-20 px-4 py-2">
              <div className="relative mb-1 h-4">
                {routeZones.map((zone, i) => {
                  const pos = ((i + 1) / (routeZones.length + 1)) * 100;
                  const passed = passedZones.includes(zone);
                  return (
                    <div key={zone.id} className="absolute -translate-x-1/2 flex flex-col items-center"
                         style={{ left: `${pos}%` }}>
                      <div className="w-2 h-2 rounded-full border"
                           style={{
                             borderColor: LEVEL_COLOR[zone.level],
                             background: passed ? LEVEL_COLOR[zone.level] : "white",
                           }} />
                    </div>
                  );
                })}
              </div>
              <div className="relative h-2 rounded-full overflow-hidden bg-slate-100">
                <motion.div className="h-full rounded-full"
                  style={{ background: "linear-gradient(to right, #22c55e, #86efac)" }}
                  animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-400">{origin || "Start"}</span>
                <span className="text-[10px] text-slate-500 font-medium">{distCovered.toFixed(2)} / {totalDist} km</span>
                <span className="text-[10px] text-slate-400">{destination}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="relative z-20 px-4 py-2">
              <div className="flex gap-3">
                {[
                  { icon: <Clock size={14} />, val: fmt(elapsed), label: "elapsed" },
                  { icon: <Zap size={14} />, val: `${etaMins}m`, label: "ETA" },
                  { icon: <Shield size={14} />, val: "2", label: "guardians" },
                ].map(s => (
                  <div key={s.label} className="flex-1 rounded-xl px-3 py-2.5 border border-slate-200 flex items-center gap-2 bg-white shadow-sm">
                    <span className="text-slate-400">{s.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{s.val}</div>
                      <div className="text-[10px] text-slate-500">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {rerouted && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="relative z-20 mx-4 mt-1 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-emerald-200 bg-emerald-50">
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-xs text-emerald-700 font-medium">Rerouted — avoiding {zoneAlert === null && routeDanger[0] ? routeDanger[0].label : "alert zone"}</span>
              </motion.div>
            )}

            {/* Live zone feed */}
            <div className="relative z-20 px-4 mt-2 flex flex-col gap-2">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="text-xs px-4 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2 bg-emerald-50">
                <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                <span className="text-emerald-700 font-medium">Route clear — 2 guardians active</span>
              </motion.div>

              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {routeZones.map((zone, i) => {
                  const passed = passedZones.includes(zone);
                  return (
                    <div key={zone.id} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-medium transition-all"
                         style={{
                           borderColor: passed ? `${LEVEL_COLOR[zone.level]}40` : "#e2e8f0",
                           background: passed ? `${LEVEL_COLOR[zone.level]}12` : "white",
                           color: passed ? LEVEL_COLOR[zone.level] : "#94a3b8",
                         }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: LEVEL_COLOR[zone.level] }} />
                      {zone.label}
                      {passed && <CheckCircle size={10} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom controls */}
            <div className="relative z-20 mt-auto pb-24 px-6 flex flex-col items-center gap-5">
              <div className="flex gap-3 w-full">
                <button onClick={() => setScreen("arrived")}
                  className="flex-1 h-12 rounded-2xl font-semibold text-sm text-emerald-600 border border-emerald-200 bg-emerald-50 shadow-sm"
                  data-testid="btn-arrived">
                  Reached destination
                </button>
                <button className="flex-1 h-12 rounded-2xl font-semibold text-sm text-violet-600 border border-violet-200 bg-violet-50 shadow-sm"
                  data-testid="btn-safe">
                  I'm Safe ✓
                </button>
              </div>
              <SOSButton />
            </div>
          </motion.div>
        )}

        {/* ── ARRIVED SCREEN ── */}
        {screen === "arrived" && (
          <motion.div key="arrived" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-full items-center justify-center px-6 text-center"
            style={{ background: "linear-gradient(135deg, #fef2f3, #ffffff)" }}>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-xl shadow-amber-200">
              <motion.span className="text-5xl"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ delay: 0.5, duration: 0.6 }}>✨</motion.span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-slate-800 mb-2">You made it! 🎉</motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-slate-500 text-base mb-2">
              {arrivalTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="text-slate-600 text-sm leading-relaxed mb-5 max-w-xs">
              {encourageMsg}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
              className="w-full rounded-2xl border border-slate-200 divide-y divide-slate-100 mb-4 bg-white shadow-sm">
              {[
                { label: "Distance covered", val: `${distCovered.toFixed(2)} km` },
                { label: "Walk duration", val: fmt(elapsed) },
                { label: "Guardians watching", val: "2" },
                { label: "Zones navigated", val: `${routeZones.length} (${routeDanger.length} avoided)` },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-5 py-3">
                  <span className="text-sm text-slate-500">{r.label}</span>
                  <span className="text-sm font-semibold text-slate-800">{r.val}</span>
                </div>
              ))}
            </motion.div>

            {routeZones.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 mb-4 flex justify-around bg-white shadow-sm">
                {([
                  { level: "safe" as const, count: routeSafe.length },
                  { level: "caution" as const, count: routeCaution.length },
                  { level: "danger" as const, count: routeDanger.length },
                ]).map(({ level, count }) => (
                  <div key={level} className="text-center">
                    <div className="text-lg font-bold" style={{ color: LEVEL_COLOR[level] }}>{count}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{level}</div>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="text-xs text-slate-400 italic mb-6">
              "Told you — Astra would keep you safe. Rest well 🌙"
            </motion.p>

            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
              onClick={() => setLocation("/home")}
              className="w-full h-14 rounded-2xl font-bold text-white text-base shadow-lg shadow-rose-200"
              style={{ background: "linear-gradient(135deg, #f43e5c, #e11d48)" }}
              data-testid="btn-done">
              Done ✓
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ZONE ALERT MODAL ── */}
      <AnimatePresence>
        {zoneAlert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end pb-10 px-5"
            style={{ background: "rgba(0,0,0,0.4)" }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              className="w-full rounded-3xl overflow-hidden border bg-white shadow-xl"
              style={{
                borderColor: zoneAlert.level === "danger" ? "rgba(244,63,94,0.3)" : "rgba(251,191,36,0.3)",
              }}>
              <div className="px-5 py-4 border-b flex items-center gap-3"
                   style={{
                     background: zoneAlert.level === "danger" ? "#fef2f2" : "#fffbeb",
                     borderColor: zoneAlert.level === "danger" ? "rgba(244,63,94,0.2)" : "rgba(251,191,36,0.2)",
                   }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                     style={{ background: `${LEVEL_COLOR[zoneAlert.level]}20` }}>
                  {zoneAlert.level === "danger"
                    ? <AlertTriangle size={18} className="text-red-500" />
                    : <Info size={18} className="text-amber-500" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {zoneAlert.level === "danger" ? "⚠️ Alert zone ahead" : "ℹ️ Caution zone ahead"}
                  </div>
                  <div className="text-xs font-medium" style={{ color: LEVEL_COLOR[zoneAlert.level] }}>
                    {zoneAlert.label}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4">
                <p className="text-sm text-slate-600 leading-relaxed mb-1">{zoneAlert.desc}</p>
                <p className="text-xs text-slate-400 mb-4">💡 {zoneAlert.tip}</p>

                {zoneAlert.incidents > 0 && (
                  <div className="flex items-center gap-2 mb-4 text-xs px-3 py-2 rounded-xl"
                       style={{ background: `${LEVEL_COLOR[zoneAlert.level]}10`, color: LEVEL_COLOR[zoneAlert.level] }}>
                    <AlertTriangle size={11} />
                    {zoneAlert.incidents} incident{zoneAlert.incidents > 1 ? "s" : ""} reported this week in this area
                  </div>
                )}

                <div className="flex gap-3">
                  {zoneAlert.level === "danger" && (
                    <button
                      onClick={() => { setZoneAlert(null); setRerouted(true); }}
                      className="flex-1 h-12 rounded-2xl font-semibold text-white text-sm shadow-md shadow-rose-200"
                      style={{ background: "linear-gradient(135deg, #f43e5c, #e11d48)" }}
                      data-testid="btn-reroute">
                      Yes, reroute me
                    </button>
                  )}
                  <button
                    onClick={() => setZoneAlert(null)}
                    className="flex-1 h-12 rounded-2xl font-semibold text-slate-600 text-sm border border-slate-200 bg-white"
                    data-testid="btn-continue-anyway">
                    {zoneAlert.level === "danger" ? "Continue anyway" : "Got it"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}