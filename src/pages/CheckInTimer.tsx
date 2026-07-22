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
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-[#083344] font-sans">
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-[#085a70]/10 bg-white/80 backdrop-blur">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-slate-100 transition-colors" data-testid="btn-back">
          <ArrowLeft size={20} className="text-[#083344]"/>
        </button>
        <div>
          <h1 className="text-lg font-black uppercase tracking-wider text-[#083344]">Check-in Timer</h1>
          <p className="text-xs font-medium text-[#085a70]/70">Regular check-ins keep you safe</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-5">

        {/* Timer ring */}
        <div className="flex flex-col items-center py-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none"
                stroke={status === "alert" ? "#fee2e2" : "#e2e8f0"} strokeWidth="10"/>
              <motion.circle cx="80" cy="80" r={r} fill="none"
                stroke={status === "alert" ? "#ef4444" : "#0d9488"}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ - (pct / 100) * circ}
                transition={{ duration: 0.5 }}/>
            </svg>
            <div className="text-center z-10">
              <AnimatePresence mode="wait">
                {status === "alert" ? (
                  <motion.div key="alert" initial={{ scale:0.5 }} animate={{ scale:1 }}>
                    <AlertCircle size={40} className="text-[#ef4444] mx-auto mb-1"/>
                    <div className="text-xs text-[#ef4444] font-black uppercase tracking-wider">Check in now!</div>
                    {gracePeriod > 0 && (
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">Notifying in {fmtSec(gracePeriod)}</div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="timer">
                    <div className="text-4xl font-black text-[#083344] tabular-nums">
                      {fmtSec(remaining || 0)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {status === "idle" ? "not started" : "until next check"}
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
              <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-3">Check-in interval</h3>
              {/* Stepper */}
              <div className="flex items-center justify-between rounded-2xl border border-[#085a70]/10 px-4 py-3 mb-3 bg-white shadow-sm">
                <button onClick={() => adjustInterval(-1)} className="w-10 h-10 rounded-full border border-[#085a70]/15 flex items-center justify-center text-[#083344] hover:bg-slate-100 transition-colors">
                  <Minus size={16}/>
                </button>
                <div className="text-center">
                  <span className="text-3xl font-black text-[#083344]">{intervalMins}</span>
                  <span className="text-xs font-black text-[#085a70]/60 ml-1 uppercase tracking-wider">min</span>
                </div>
                <button onClick={() => adjustInterval(1)} className="w-10 h-10 rounded-full border border-[#085a70]/15 flex items-center justify-center text-[#083344] hover:bg-slate-100 transition-colors">
                  <Plus size={16}/>
                </button>
              </div>

              {/* Preset chips */}
              <div className="flex gap-2 mb-3">
                {PRESETS.map(i => (
                  <button key={i} onClick={() => setIntervalMins(i)} data-testid={`interval-${i}`}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider border ${intervalMins === i ? "border-[#0d9488] bg-[#0d9488]/10 text-[#0d9488]" : "border-[#085a70]/15 text-[#085a70]/70 bg-white hover:bg-slate-50"}`}>
                    {i}m
                  </button>
                ))}
                <button onClick={() => setShowCustom(!showCustom)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-wider border border-[#085a70]/15 text-[#085a70]/70 bg-white hover:bg-slate-50">
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
                      className="flex-1 bg-white border border-[#085a70]/15 rounded-xl px-4 py-2.5 text-xs font-bold text-[#083344] outline-none focus:border-[#0d9488]/50"/>
                    <button onClick={applyCustom} className="px-5 py-2.5 rounded-xl font-black text-white text-xs uppercase tracking-wider bg-[#0d9488] hover:bg-[#0f766e] transition-colors">Set</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notify after setting */}
            <div className="rounded-2xl border border-[#085a70]/10 p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-[#0d9488]"/>
                <h3 className="text-xs font-black text-[#083344] uppercase tracking-wider">Notify contacts if missed</h3>
              </div>
              <p className="text-xs text-[#085a70]/70 mb-3 font-medium">How long after a missed check-in should your emergency contacts be notified?</p>
              <div className="flex gap-2">
                {[1, 2, 5, 10].map(m => (
                  <button key={m} onClick={() => setNotifyAfterMins(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all uppercase tracking-wider ${notifyAfterMins === m ? "border-[#0d9488] bg-[#0d9488]/10 text-[#0d9488]" : "border-[#085a70]/15 text-[#085a70]/70 bg-white hover:bg-slate-50"}`}>
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
            <Button onClick={start} className="w-full h-12 rounded-full font-black text-xs uppercase tracking-widest text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors" data-testid="btn-start-timer">
              <Clock size={16} className="mr-2"/> Start Timer
            </Button>
          )}
          {status === "running" && (
            <>
              <Button onClick={checkIn} className="w-full h-12 rounded-full font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white" data-testid="btn-check-in">
                <CheckCircle size={16} className="mr-2"/> I'm Safe — Check In
              </Button>
              <button onClick={stop} className="w-full h-10 rounded-full text-xs font-black uppercase tracking-wider text-rose-500 border border-rose-200 hover:bg-rose-50/50 transition-colors" data-testid="btn-stop-timer">
                Stop Timer
              </button>
            </>
          )}
          {status === "alert" && (
            <>
              <motion.div animate={{ scale:[1,1.03,1] }} transition={{ repeat:Infinity, duration:0.8 }}>
                <Button onClick={checkIn} className="w-full h-14 rounded-full font-black text-sm uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-500" data-testid="btn-check-in-alert">
                  <Bell size={18} className="mr-2 animate-bounce"/> I'm Safe Now
                </Button>
              </motion.div>
              {gracePeriod > 0 && (
                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Contacts will be notified in <strong className="text-rose-500">{fmtSec(gracePeriod)}</strong>
                </p>
              )}
              <button onClick={stop} className="w-full text-xs font-bold text-[#085a70]/60 hover:text-[#083344] uppercase tracking-wider" data-testid="btn-stop-alert">
                Cancel check-ins
              </button>
            </>
          )}
        </div>

        {/* History */}
        {checkIns.length > 0 && (
          <div>
            <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-3">Check-in history</h3>
            <div className="flex flex-col gap-2">
              {checkIns.slice(0, 6).map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#085a70]/10 bg-white shadow-xs">
                  <CheckCircle size={16} className="text-emerald-500"/>
                  <span className="text-xs font-bold text-[#083344] uppercase tracking-wider">Safe</span>
                  <span className="text-[10px] font-bold text-slate-400 ml-auto">{c.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-sm">
          <h4 className="text-[10px] font-black text-[#085a70]/70 mb-2 uppercase tracking-widest">How it works</h4>
          <p className="text-xs text-[#085a70]/80 leading-relaxed font-medium">
            When the timer runs out, you have <strong className="text-[#083344]">{notifyAfterMins} minute{notifyAfterMins > 1 ? "s" : ""}</strong> to check in. If you don't, your emergency contacts and nearest guardians are automatically notified.
          </p>
        </div>
      </div>
    </div>
  );
}
