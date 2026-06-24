import { useState, useEffect, useRef } from "react";
import { MapBackground } from "@/components/MapBackground";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Volume2, Zap, PhoneOff, X } from "lucide-react";
import { guardians } from "@/lib/mockData";

type AlarmState = "off" | "on";
type FlashState = "off" | "on";

const SOS_MSG = "🚨 SOS ALERT: I need help right now. My location is being shared. Please call me immediately. — Sent via Astra safety app";

export function SOSScreen() {
  const [, setLocation] = useLocation();
  const [alarm, setAlarm] = useState<AlarmState>("on");
  const [flash, setFlash] = useState<FlashState>("on");
  const [msgSent, setMsgSent] = useState(false);
  const [calling, setCalling] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [progress, setProgress] = useState(33);
  const alarmRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Flash simulation
  useEffect(() => {
    if (flash === "on") {
      let bright = true;
      flashTimerRef.current = setInterval(() => {
        document.body.style.background = bright ? "#ff0000" : "";
        bright = !bright;
      }, 200);
    } else {
      if (flashTimerRef.current) clearInterval(flashTimerRef.current);
      document.body.style.background = "";
    }
    return () => {
      if (flashTimerRef.current) clearInterval(flashTimerRef.current);
      document.body.style.background = "";
    };
  }, [flash]);

  // Alarm sound
  useEffect(() => {
    if (alarm === "on") {
      try {
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        alarmRef.current = osc;
        gainRef.current = gain;
        osc.type = "square";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        let hi = true;
        const interval = setInterval(() => {
          if (alarmRef.current) { alarmRef.current.frequency.setValueAtTime(hi ? 880 : 660, ctx.currentTime); hi = !hi; }
        }, 300);
        return () => {
          clearInterval(interval);
          try { osc.stop(); ctx.close(); } catch {}
        };
      } catch { return; }
    } else {
      try { alarmRef.current?.stop(); audioCtxRef.current?.close(); } catch {}
    }
  }, [alarm]);

  // Progress bar animation
  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 400);
    return () => clearInterval(t);
  }, []);

  // Simulate msg sent
  useEffect(() => {
    const t = setTimeout(() => setMsgSent(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const callGuardian = (name: string) => {
    setCalling(name);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
  };

  const endCall = () => {
    setCalling(null);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
  };

  useEffect(() => () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    try { alarmRef.current?.stop(); audioCtxRef.current?.close(); } catch {}
    if (flashTimerRef.current) clearInterval(flashTimerRef.current);
    document.body.style.background = "";
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col" style={{ background: "#130505" }}>
      {/* Red tinted map */}
      <div className="absolute inset-0 bg-red-900/40 z-0 mix-blend-multiply"/>
      <MapBackground />

      {/* TOP BANNER */}
      <div className="relative z-10 bg-red-600/90 backdrop-blur text-white px-5 pt-14 pb-5 border-b border-red-400/30">
        <div className="flex items-center justify-between mb-3">
          <motion.h1 animate={{ opacity:[1,0.5,1] }} transition={{ repeat:Infinity, duration:0.8 }}
            className="text-xl font-bold tracking-widest uppercase flex items-center gap-2">
            🚨 Emergency Active
          </motion.h1>
          <button onClick={() => { alarm === "on" && setAlarm("off"); flash === "on" && setFlash("off"); setLocation("/safe"); }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30" data-testid="btn-safe-now">
            <X size={16}/>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {msgSent ? (
            <motion.p key="sent" initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-sm text-white/90 mb-2">
              ✅ Emergency message sent to your contacts
            </motion.p>
          ) : (
            <motion.p key="sending" animate={{ opacity:[1,0.5,1] }} transition={{ repeat:Infinity, duration:0.6 }}
              className="text-sm text-white/80 mb-2">Alerting guardians…</motion.p>
          )}
        </AnimatePresence>

        {/* Emergency message preview */}
        <div className="bg-black/20 rounded-xl p-2.5 mb-3">
          <p className="text-xs text-white/70 leading-relaxed">{SOS_MSG}</p>
        </div>

        <div className="w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-white rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}/>
        </div>
        <p className="text-xs mt-1.5 text-white/70 tracking-widest">{Math.round(progress / 33)}/3 CONTACTS ALERTED</p>
      </div>

      {/* GUARDIAN LIST */}
      <div className="relative z-10 px-5 pt-4 flex-1 flex flex-col overflow-y-auto">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Guardians near you</h3>
        <div className="flex flex-col gap-3">
          {guardians.map((g, i) => (
            <motion.div key={g.id}
              initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 p-4 flex items-center justify-between"
              style={{ background: "rgba(20,5,5,0.85)", backdropFilter:"blur(12px)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                     style={{ background:"rgba(232,93,122,0.2)", color:"#e85d7a" }}>
                  {g.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{g.name}</div>
                  <div className="text-xs text-slate-400">{g.distance} away</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {g.status === "arriving" && <span className="text-xs font-medium text-green-300">⏱ ETA {g.eta}</span>}
                {g.status === "police" && <span className="text-xs font-medium text-blue-400">Called police</span>}
                {g.status === "online" && <span className="text-xs font-medium text-teal-400">On the line</span>}
                {g.phone && (
                  <button onClick={() => callGuardian(g.name)}
                    className="mt-1 bg-green-600/80 rounded-full px-3 py-1 text-white text-xs font-semibold flex items-center gap-1"
                    data-testid={`btn-call-${g.id}`}>
                    <Phone size={11}/> Call
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="relative z-10 px-5 pb-10 pt-3 flex flex-col gap-3"
           style={{ background: "linear-gradient(to top, #130505 60%, transparent)" }}>
        <div className="flex gap-3">
          <button onClick={() => setAlarm(a => a === "on" ? "off" : "on")}
            className={`flex-1 rounded-xl py-3 flex flex-col items-center gap-1 border transition-all ${alarm === "on" ? "border-amber-400/40 bg-amber-400/15" : "border-white/10 bg-white/5"}`}
            data-testid="btn-alarm">
            <Volume2 size={20} className={alarm === "on" ? "text-amber-400" : "text-slate-400"}/>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Alarm {alarm === "on" ? "(On)" : "(Off)"}</span>
          </button>
          <button onClick={() => setFlash(f => f === "on" ? "off" : "on")}
            className={`flex-1 rounded-xl py-3 flex flex-col items-center gap-1 border transition-all ${flash === "on" ? "border-yellow-400/40 bg-yellow-400/15" : "border-white/10 bg-white/5"}`}
            data-testid="btn-flash">
            <Zap size={20} className={flash === "on" ? "text-yellow-400" : "text-slate-400"}/>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Flash {flash === "on" ? "(On)" : "(Off)"}</span>
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={() => callGuardian(guardians[0].name)}
            className="flex-1 h-14 rounded-full font-bold text-white flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
            data-testid="btn-call-closest">
            <Phone size={18}/> Call Closest
          </button>
          <a href="tel:112"
            className="flex-1 h-14 rounded-full font-bold text-white flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
            data-testid="btn-call-police">
            <Phone size={18}/> Call 112
          </a>
        </div>

        <button onClick={() => { setAlarm("off"); setFlash("off"); setLocation("/safe"); }}
          className="w-full h-12 rounded-full font-medium text-white border border-white/20 bg-white/5 text-sm"
          data-testid="btn-safe">
          I'm Safe Now
        </button>
      </div>

      {/* CALLING MODAL */}
      <AnimatePresence>
        {calling && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "rgba(0,0,0,0.93)" }}>
            <motion.div
              animate={{ scale:[1,1.06,1] }} transition={{ repeat:Infinity, duration:2 }}
              className="w-24 h-24 rounded-full bg-green-600/20 border-2 border-green-500/40 flex items-center justify-center mb-5 text-4xl">
              🙏
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-1">Calling {calling}</h2>
            <p className="text-green-400 text-base font-semibold">{fmt(callDuration)}</p>
            <p className="text-slate-400 text-sm mt-1 mb-12">Simulated emergency call</p>
            <button onClick={endCall}
              className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/50">
              <PhoneOff size={28} className="text-white"/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
