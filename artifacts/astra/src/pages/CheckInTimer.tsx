import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Clock, Bell, CheckCircle, AlertCircle, Minus, Plus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PRESETS = [5, 10, 15, 20, 30];

export function CheckInTimer() {
  const [, setLocation] = useLocation();
  const [intervalMins, setIntervalMins] = useState(10);
  const [notifyAfterMins, setNotifyAfterMins] = useState(2);
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [checkIns, setCheckIns] = useState<Array<{time: string; status: "safe" | "missed"}>>([]);
  const [status, setStatus] = useState<"idle"|"running"|"alert">("idle");
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [gracePeriod, setGracePeriod] = useState(0);
  const [graceTick, setGraceTick] = useState(false);

  useEffect(() => {
    let tick: NodeJS.Timeout;
    if (active && remaining > 0) {
      tick = setTimeout(() => setRemaining(r => r - 1), 1000);
    } else if (active && remaining === 0 && status === "running") {
      setStatus("alert");
      setGracePeriod(notifyAfterMins * 60);
      setGraceTick(true);
      setActive(false);
    }
    return () => clearTimeout(tick);
  }, [active, remaining, status, notifyAfterMins]);

  // Grace period countdown
  useEffect(() => {
    if (!graceTick || gracePeriod <= 0) return;
    const t = setTimeout(() => setGracePeriod(g => {
      if (g <= 1) { setGraceTick(false); return 0; }
      return g - 1;
    }), 1000);
    return () => clearTimeout(t);
  }, [graceTick, gracePeriod]);

  const start = () => {
    setRemaining(intervalMins * 60);
    setActive(true);
    setStatus("running");
    setGracePeriod(0);
    setGraceTick(false);
  };

  const checkIn = () => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
    setCheckIns(prev => [{ time: timeStr, status: "safe" }, ...prev]);
    setRemaining(intervalMins * 60);
    setStatus("running");
    setActive(true);
    setGracePeriod(0);
    setGraceTick(false);
  };

  const stop = () => { setActive(false); setStatus("idle"); setRemaining(0); setGraceTick(false); };

  const adjustInterval = (delta: number) => {
    setIntervalMins(m => Math.max(1, Math.min(60, m + delta)));
  };

  const applyCustom = () => {
    const v = parseInt(customInput);
    if (v >= 1 && v <= 120) { setIntervalMins(v); setShowCustom(false); setCustomInput(""); }
  };

  const pct = active ? ((intervalMins * 60 - remaining) / (intervalMins * 60)) * 100 : 0;
  const r = 72;
  const circ = 2 * Math.PI * r;
  const fmtSec = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Check-in Timer</h1>
          <p className="text-xs text-slate-400">Regular check-ins keep you safe</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-5">

        {/* Timer ring */}
        <div className="flex flex-col items-center py-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none"
                stroke={status === "alert" ? "#2d0a0a" : "#1e293b"} strokeWidth="10"/>
              <motion.circle cx="80" cy="80" r={r} fill="none"
                stroke={status === "alert" ? "#e85d7a" : "#22c55e"}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ - (pct / 100) * circ}
                transition={{ duration: 0.5 }}/>
            </svg>
            <div className="text-center z-10">
              <AnimatePresence mode="wait">
                {status === "alert" ? (
                  <motion.div key="alert" initial={{ scale:0.5 }} animate={{ scale:1 }}>
                    <AlertCircle size={40} className="text-primary mx-auto mb-1"/>
                    <div className="text-xs text-primary font-bold">Check in now!</div>
                    {gracePeriod > 0 && (
                      <div className="text-xs text-slate-400 mt-1">Notifying in {fmtSec(gracePeriod)}</div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="timer">
                    <div className="text-4xl font-bold text-white tabular-nums">
                      {fmtSec(remaining || 0)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {status === "idle" ? "not started" : "until next check-in"}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Interval setter */}
        {status === "idle" && (
          <>
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Check-in interval</h3>
              {/* Stepper */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 mb-3" style={{ background:"#111827" }}>
                <button onClick={() => adjustInterval(-1)} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10">
                  <Minus size={16}/>
                </button>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">{intervalMins}</span>
                  <span className="text-sm text-slate-400 ml-1">min</span>
                </div>
                <button onClick={() => adjustInterval(1)} className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white hover:bg-white/10">
                  <Plus size={16}/>
                </button>
              </div>

              {/* Preset chips */}
              <div className="flex gap-2 mb-3">
                {PRESETS.map(i => (
                  <button key={i} onClick={() => setIntervalMins(i)} data-testid={`interval-${i}`}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${intervalMins === i ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-slate-400 bg-[#111827]"}`}>
                    {i}m
                  </button>
                ))}
                <button onClick={() => setShowCustom(!showCustom)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium border border-white/10 text-slate-400 bg-[#111827]">
                  Custom
                </button>
              </div>

              {/* Custom input */}
              <AnimatePresence>
                {showCustom && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                    className="flex gap-2 mb-3">
                    <input value={customInput} onChange={e => setCustomInput(e.target.value.replace(/\D/g,""))}
                      placeholder="Enter minutes (1–120)" type="number" min="1" max="120"
                      className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none"/>
                    <button onClick={applyCustom} className="px-4 py-2.5 rounded-xl font-semibold text-white text-sm"
                      style={{ background:"#e85d7a" }}>Set</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notify after setting */}
            <div className="rounded-2xl border border-white/10 p-4" style={{ background:"#111827" }}>
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-teal-400"/>
                <h3 className="text-sm font-semibold text-white">Notify contacts if missed</h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">How long after a missed check-in should your emergency contacts be notified?</p>
              <div className="flex gap-2">
                {[1, 2, 5, 10].map(m => (
                  <button key={m} onClick={() => setNotifyAfterMins(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${notifyAfterMins === m ? "border-teal-400 bg-teal-400/10 text-teal-400" : "border-white/10 text-slate-400"}`}>
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {status === "idle" && (
            <Button onClick={start} className="w-full h-12 rounded-full font-semibold text-white bg-primary" data-testid="btn-start-timer">
              <Clock size={18} className="mr-2"/> Start Timer
            </Button>
          )}
          {status === "running" && (
            <>
              <Button onClick={checkIn} className="w-full h-12 rounded-full font-semibold bg-green-600 hover:bg-green-500 text-white" data-testid="btn-check-in">
                <CheckCircle size={18} className="mr-2"/> I'm Safe — Check In
              </Button>
              <button onClick={stop} className="w-full h-10 rounded-full text-sm text-slate-400 border border-white/10" data-testid="btn-stop-timer">
                Stop Timer
              </button>
            </>
          )}
          {status === "alert" && (
            <>
              <motion.div animate={{ scale:[1,1.03,1] }} transition={{ repeat:Infinity, duration:0.8 }}>
                <Button onClick={checkIn} className="w-full h-14 rounded-full font-bold text-white bg-primary text-base" data-testid="btn-check-in-alert">
                  <Bell size={20} className="mr-2"/> I'm Safe Now
                </Button>
              </motion.div>
              {gracePeriod > 0 && (
                <p className="text-center text-xs text-slate-400">
                  Contacts will be notified in <strong className="text-primary">{fmtSec(gracePeriod)}</strong>
                </p>
              )}
              <button onClick={stop} className="w-full text-sm text-slate-500" data-testid="btn-stop-alert">
                Cancel check-ins
              </button>
            </>
          )}
        </div>

        {/* History */}
        {checkIns.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Check-in history</h3>
            <div className="flex flex-col gap-2">
              {checkIns.slice(0, 6).map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/10" style={{ background:"#111827" }}>
                  <CheckCircle size={16} className="text-green-400"/>
                  <span className="text-sm text-white">Safe</span>
                  <span className="text-xs text-slate-500 ml-auto">{c.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl p-4 border border-white/10" style={{ background:"#111827" }}>
          <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">How it works</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            When the timer runs out, you have <strong className="text-white">{notifyAfterMins} minute{notifyAfterMins > 1 ? "s" : ""}</strong> to check in. If you don't, your emergency contact and nearest guardians are automatically notified.
          </p>
        </div>
      </div>
    </div>
  );
}
