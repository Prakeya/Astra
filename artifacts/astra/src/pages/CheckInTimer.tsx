import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Clock, Bell, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const INTERVALS = [5, 10, 15, 20, 30];

export function CheckInTimer() {
  const [, setLocation] = useLocation();
  const [interval, setInterval_] = useState(10);
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [checkIns, setCheckIns] = useState<Array<{time: string; status: "safe" | "missed"}>>([]);
  const [status, setStatus] = useState<"idle"|"running"|"alert">("idle");

  useEffect(() => {
    let tick: NodeJS.Timeout;
    if (active && remaining > 0) {
      tick = setTimeout(() => setRemaining(r => r - 1), 1000);
    } else if (active && remaining === 0) {
      setStatus("alert");
      setActive(false);
    }
    return () => clearTimeout(tick);
  }, [active, remaining]);

  const start = () => {
    setRemaining(interval * 60);
    setActive(true);
    setStatus("running");
  };

  const checkIn = () => {
    const now = new Date();
    setCheckIns(prev => [{ time: `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`, status: "safe" }, ...prev]);
    setRemaining(interval * 60);
    setStatus("running");
    setActive(true);
  };

  const stop = () => { setActive(false); setStatus("idle"); setRemaining(0); };

  const pct = active ? ((interval*60 - remaining) / (interval*60)) * 100 : 0;
  const r = 72;
  const circ = 2 * Math.PI * r;

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

      <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-5">
        {/* Timer ring */}
        <div className="flex flex-col items-center py-6">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={r} fill="none"
                stroke={status === "alert" ? "#2d0a0a" : "#1e293b"} strokeWidth="10"/>
              <motion.circle cx="80" cy="80" r={r} fill="none"
                stroke={status === "alert" ? "#e85d7a" : "#22c55e"}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ - (pct/100)*circ}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="text-center z-10">
              <AnimatePresence mode="wait">
                {status === "alert" ? (
                  <motion.div key="alert" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                    <AlertCircle size={40} className="text-primary mx-auto mb-1"/>
                    <div className="text-xs text-primary font-semibold">Check in now!</div>
                  </motion.div>
                ) : (
                  <motion.div key="timer">
                    <div className="text-4xl font-bold text-white tabular-nums">
                      {String(Math.floor(remaining/60)).padStart(2,"0")}:{String(remaining%60).padStart(2,"0")}
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

        {/* Interval selector */}
        {status === "idle" && (
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Check-in every</h3>
            <div className="flex gap-2">
              {INTERVALS.map(i => (
                <button
                  key={i}
                  onClick={() => setInterval_(i)}
                  data-testid={`interval-${i}`}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${interval === i ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-slate-400 bg-[#111827]"}`}
                >
                  {i}m
                </button>
              ))}
            </div>
          </div>
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
              <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <Button onClick={checkIn} className="w-full h-14 rounded-full font-bold text-white bg-primary text-base" data-testid="btn-check-in-alert">
                  <Bell size={20} className="mr-2"/> I'm Safe Now
                </Button>
              </motion.div>
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
              {checkIns.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/10" style={{ background: "#111827" }}>
                  <CheckCircle size={16} className="text-green-400"/>
                  <span className="text-sm text-white">Safe</span>
                  <span className="text-xs text-slate-500 ml-auto">{c.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl p-4 border border-white/10" style={{ background: "#111827" }}>
          <h4 className="text-xs font-semibold text-slate-400 mb-2">HOW IT WORKS</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            When the timer expires, you'll receive an alert. If you don't check in within 60 seconds, your emergency contacts and nearest guardians are automatically notified.
          </p>
        </div>
      </div>
    </div>
  );
}
