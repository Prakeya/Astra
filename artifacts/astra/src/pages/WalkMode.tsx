import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { MapBackground } from "@/components/MapBackground";
import { SOSButton } from "@/components/SOSButton";
import { ArrowLeft, Navigation, AlertTriangle, CheckCircle, Shield, Clock, Zap } from "lucide-react";

const ENCOURAGEMENTS = [
  "You've got this, Astra's with you every step 💪",
  "Staying alert — you're doing amazing 🌟",
  "Almost there! Keep going, you're safe 🛡️",
  "Astra is proud of you. Well done! ✨",
  "Home safe — told you Astra would take care of you 😊",
];

const DARK_ALLEYS = [
  { label: "Dark alley near Station Rd", trigger: 18, lat: 12.97, lng: 77.59 },
  { label: "Poorly lit lane on MG Road", trigger: 35, lat: 12.98, lng: 77.60 },
];

type Screen = "setup" | "walking" | "arrived";

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
  const [alleyAlert, setAlleyAlert] = useState<typeof DARK_ALLEYS[0] | null>(null);
  const [rerouted, setRerouted] = useState(false);
  const [walkStart, setWalkStart] = useState<Date | null>(null);
  const [encourageMsg] = useState(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const alleyRef = useRef(false);

  const startWalk = () => {
    if (!origin.trim()) { setOriginErr("Starting point is required"); return; }
    if (!destination.trim()) { setDestErr("Destination is required"); return; }
    setScreen("walking");
    setWalkStart(new Date());
    setElapsed(0);
    setDistCovered(0);
  };

  useEffect(() => {
    if (screen !== "walking") return;
    tickRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        setDistCovered(Math.min((next / 540) * totalDist, totalDist));
        DARK_ALLEYS.forEach(a => {
          if (next === a.trigger && !alleyRef.current && !rerouted) {
            alleyRef.current = true;
            setAlleyAlert(a);
          }
        });
        if (next >= 540) {
          if (tickRef.current) clearInterval(tickRef.current);
          setScreen("arrived");
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [screen, rerouted, totalDist]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const etaMins = Math.max(0, Math.ceil((540 - elapsed) / 60));
  const pct = Math.min((distCovered / totalDist) * 100, 100);
  const arrivalTime = walkStart ? new Date(walkStart.getTime() + elapsed * 1000) : new Date();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col" style={{ background: "#080f1c" }}>
      <AnimatePresence mode="wait">

        {/* ── SETUP SCREEN ── */}
        {screen === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full">
            <MapBackground />
            <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(8,15,28,0.85) 0%, rgba(8,15,28,0.4) 40%, rgba(8,15,28,0.9) 80%)" }}/>

            <div className="relative z-20 flex flex-col h-full px-5">
              <div className="pt-12 pb-4">
                <button onClick={() => setLocation("/home")} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
                  <ArrowLeft size={18}/> Back
                </button>
              </div>

              <div className="mt-4 mb-6">
                <h1 className="text-3xl font-bold text-white mb-1">Plan your walk</h1>
                <p className="text-sm text-slate-400">Astra will guide and guard you the whole way 🛡️</p>
              </div>

              <div className="rounded-3xl border border-white/10 overflow-hidden mb-4" style={{ background: "rgba(15,25,45,0.95)" }}>
                {/* Origin */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0"/>
                    <input value={origin} onChange={e => { setOrigin(e.target.value); setOriginErr(""); }}
                      placeholder="Starting point (e.g. My home, Library)"
                      className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none flex-1"/>
                  </div>
                  {originErr && <p className="text-xs text-red-400 mt-1.5 ml-5">{originErr}</p>}
                </div>
                {/* Destination */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"/>
                    <input value={destination} onChange={e => { setDestination(e.target.value); setDestErr(""); }}
                      placeholder="Destination (e.g. College, Metro station)"
                      className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none flex-1"/>
                  </div>
                  {destErr && <p className="text-xs text-red-400 mt-1.5 ml-5">{destErr}</p>}
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {["College","Office","Metro Station","Mall","Hospital"].map(s => (
                  <button key={s} onClick={() => { setDestination(s); setDestErr(""); }}
                    className="px-3 py-1.5 rounded-full text-xs border border-white/15 text-slate-300 bg-white/5 hover:bg-white/10 transition-colors">
                    {s}
                  </button>
                ))}
              </div>

              {/* Info cards */}
              <div className="flex gap-3 mb-6">
                {[{ icon:"🛡️", label:"2 Guardians", sub:"active nearby" },
                  { icon:"📍", label:"GPS Active", sub:"location shared" },
                  { icon:"🔔", label:"SOS Ready", sub:"hold 2s" }].map(c => (
                  <div key={c.label} className="flex-1 rounded-2xl p-3 text-center border border-white/10" style={{ background: "rgba(15,25,45,0.8)" }}>
                    <div className="text-xl mb-1">{c.icon}</div>
                    <div className="text-xs font-semibold text-white">{c.label}</div>
                    <div className="text-[10px] text-slate-500">{c.sub}</div>
                  </div>
                ))}
              </div>

              <button onClick={startWalk}
                className="w-full h-14 rounded-full font-bold text-white text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #e85d7a, #c23a5a)" }}
                data-testid="btn-start-walk">
                <Navigation size={20}/> Start Walking
              </button>
            </div>
          </motion.div>
        )}

        {/* ── WALKING SCREEN ── */}
        {screen === "walking" && (
          <motion.div key="walking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col h-full">
            <MapBackground active={true}/>
            <div className="absolute inset-0 z-5" style={{ background: "rgba(8,15,28,0.35)" }}/>

            {/* Header */}
            <div className="relative z-20 pt-12 px-4 pb-3"
                 style={{ background: "linear-gradient(to bottom, rgba(8,15,28,0.95), transparent)" }}>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setLocation("/home")} className="p-2 rounded-full bg-white/10">
                  <ArrowLeft size={18} className="text-white"/>
                </button>
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-medium">Walking to</div>
                  <div className="text-sm font-bold text-white">{destination}</div>
                </div>
                <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                  <span className="text-xs text-green-300 font-semibold">Live</span>
                </div>
              </div>
            </div>

            {/* Route progress bar (full width) */}
            <div className="relative z-20 px-4 py-2">
              <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "#1e293b" }}>
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(to right, #22c55e, #86efac)" }}
                  animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}/>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-500">{origin}</span>
                <span className="text-[10px] text-slate-400 font-medium">{distCovered.toFixed(2)} / {totalDist} km</span>
                <span className="text-[10px] text-slate-500">{destination}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="relative z-20 px-4 py-2">
              <div className="flex gap-3">
                {[
                  { icon:<Clock size={14}/>, val: fmt(elapsed), label:"elapsed" },
                  { icon:<Zap size={14}/>, val:`${etaMins}m`, label:"ETA" },
                  { icon:<Shield size={14}/>, val:"2", label:"guardians" },
                ].map(s => (
                  <div key={s.label} className="flex-1 rounded-xl px-3 py-2 border border-white/10 flex items-center gap-2"
                       style={{ background: "rgba(15,25,45,0.85)" }}>
                    <span className="text-slate-400">{s.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{s.val}</div>
                      <div className="text-[10px] text-slate-500">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rerouted badge */}
            {rerouted && (
              <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                className="relative z-20 mx-4 rounded-xl px-4 py-2 flex items-center gap-2 border border-green-500/30"
                style={{ background: "rgba(21,128,61,0.15)" }}>
                <CheckCircle size={14} className="text-green-400"/>
                <span className="text-xs text-green-300">Rerouted — avoiding dark alley</span>
              </motion.div>
            )}

            {/* Alerts feed */}
            <div className="relative z-20 px-4 py-2 flex flex-col gap-2">
              <motion.div initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                className="text-xs px-4 py-2.5 rounded-xl border border-green-500/20 flex items-center gap-2"
                style={{ background: "rgba(21,128,61,0.1)" }}>
                <CheckCircle size={12} className="text-green-400 shrink-0"/>
                <span className="text-green-300">Route clear — 2 guardians active</span>
              </motion.div>
            </div>

            {/* Bottom controls */}
            <div className="relative z-20 mt-auto pb-20 px-6 flex flex-col items-center gap-5">
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setScreen("arrived")}
                  className="flex-1 h-12 rounded-full font-semibold text-sm text-white border border-green-500/40 bg-green-500/10"
                  data-testid="btn-arrived">
                  Reached destination
                </button>
                <button
                  className="flex-1 h-12 rounded-full font-semibold text-sm text-white border border-blue-500/40 bg-blue-500/10"
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
          <motion.div key="arrived" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="flex flex-col h-full items-center justify-center px-6 text-center"
            style={{ background: "linear-gradient(135deg, #09111f, #0d1a2e)" }}>

            {/* Sparkle icon */}
            <motion.div
              initial={{ scale:0 }} animate={{ scale:1 }}
              transition={{ type:"spring", stiffness:200, damping:15, delay:0.2 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}>
              <motion.span className="text-5xl"
                animate={{ rotate:[0,-10,10,-10,10,0] }}
                transition={{ delay:0.5, duration:0.6 }}>✨</motion.span>
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
              className="text-4xl font-bold text-white mb-2">You made it! 🎉</motion.h1>

            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
              className="text-slate-400 text-base mb-2">
              {arrivalTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </motion.p>

            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
              className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xs">
              {encourageMsg}
            </motion.p>

            {/* Stats */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }}
              className="w-full rounded-2xl border border-white/10 divide-y divide-white/10 mb-6"
              style={{ background: "#111827" }}>
              {[
                { label:"Distance covered", val:`${distCovered.toFixed(2)} km` },
                { label:"Walk duration", val:fmt(elapsed) },
                { label:"Guardians watching", val:"2" },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-5 py-3">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className="text-sm font-semibold text-white">{r.val}</span>
                </div>
              ))}
            </motion.div>

            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
              className="text-xs text-slate-500 italic mb-6">
              "Told you — Astra would keep you safe. Rest well 🌙"
            </motion.p>

            <motion.button initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.3 }}
              onClick={() => setLocation("/home")}
              className="w-full h-14 rounded-full font-bold text-white text-base"
              style={{ background: "linear-gradient(135deg, #e85d7a, #c23a5a)" }}
              data-testid="btn-done">
              Done ✓
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark Alley Alert Modal */}
      <AnimatePresence>
        {alleyAlert && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="absolute inset-0 z-50 flex flex-end items-end pb-10 px-5"
            style={{ background: "rgba(0,0,0,0.7)" }}>
            <motion.div initial={{ y:80 }} animate={{ y:0 }} exit={{ y:80 }}
              className="w-full rounded-3xl overflow-hidden border border-amber-500/30"
              style={{ background: "#12100a" }}>
              <div className="bg-amber-500/15 px-5 py-4 border-b border-amber-500/20 flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-400"/>
                <div>
                  <div className="font-bold text-white text-sm">⚠️ Dark alley ahead</div>
                  <div className="text-xs text-amber-300">{alleyAlert.label}</div>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  There's a poorly-lit area ahead. Community reports show 3 incidents here last week. Do you want Astra to reroute you?
                </p>
                <div className="flex gap-3">
                  <button onClick={() => { setAlleyAlert(null); setRerouted(true); alleyRef.current = false; }}
                    className="flex-1 h-12 rounded-full font-semibold text-white text-sm"
                    style={{ background: "linear-gradient(135deg, #e85d7a, #c23a5a)" }}
                    data-testid="btn-reroute">
                    Yes, reroute me
                  </button>
                  <button onClick={() => { setAlleyAlert(null); alleyRef.current = false; }}
                    className="flex-1 h-12 rounded-full font-semibold text-slate-300 text-sm border border-white/15 bg-white/5"
                    data-testid="btn-continue-anyway">
                    Continue anyway
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
