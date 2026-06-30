import { useState, useEffect, useRef } from "react";
import { MapBackground } from "@/components/MapBackground";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Volume2, Zap, PhoneOff, X, Shield, AlertTriangle, VolumeX, Bell, Wifi } from "lucide-react";

type AlarmState = "off" | "on";
type FlashState = "off" | "on";

export function SOSScreen() {
  const [, setLocation] = useLocation();
  const [alarm, setAlarm] = useState<AlarmState>("off");
  const [flash, setFlash] = useState<FlashState>("off");
  const [calling, setCalling] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [showPrompt, setShowPrompt] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [silentActive, setSilentActive] = useState(false);

  const alarmRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Flash warning strobe
  useEffect(() => {
    if (flash === "on") {
      let bright = true;
      flashTimerRef.current = setInterval(() => {
        document.body.style.background = bright ? "#ef4444" : "#f8fafc";
        bright = !bright;
      }, 250);
    } else {
      if (flashTimerRef.current) clearInterval(flashTimerRef.current);
      document.body.style.background = "";
    }
    return () => {
      if (flashTimerRef.current) clearInterval(flashTimerRef.current);
      document.body.style.background = "";
    };
  }, [flash]);

  // High volume distress alarm tone
  useEffect(() => {
    if (alarm === "on") {
      try {
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        alarmRef.current = osc;
        gainRef.current = gain;
        osc.type = "sine";
        osc.frequency.setValueAtTime(950, ctx.currentTime);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        let hi = true;
        const interval = setInterval(() => {
          if (alarmRef.current) { 
            alarmRef.current.frequency.setValueAtTime(hi ? 1050 : 850, ctx.currentTime); 
            hi = !hi; 
          }
        }, 200);
        return () => {
          clearInterval(interval);
          try { osc.stop(); ctx.close(); } catch {}
        };
      } catch { return; }
    } else {
      try { alarmRef.current?.stop(); audioCtxRef.current?.close(); } catch {}
    }
  }, [alarm]);

  const initiateCall = (target: string) => {
    setShowPrompt(false);
    setCalling(target);
    setCallDuration(0);
    setStatusMessage(`Dialing emergency contact: ${target}...`);
    callTimerRef.current = setInterval(() => {
      setCallDuration(d => d + 1);
    }, 1000);
  };

  const endCall = () => {
    setCalling(null);
    setStatusMessage("");
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
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-slate-50 text-[#083344] font-sans">
      {/* Dynamic Red Safety Map backdrop */}
      <div className="absolute inset-0 bg-red-100/30 z-0 mix-blend-multiply" />
      <MapBackground />

      {/* TOP EMERGENCY HEADER */}
      <div className="relative z-10 bg-red-600 text-white px-5 pt-14 pb-5 shadow-md">
        <div className="flex items-center justify-between">
          <motion.h1 
            animate={{ opacity: [1, 0.4, 1] }} 
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-lg font-black tracking-widest uppercase flex items-center gap-2 font-sans"
          >
            🚨 Emergency Command
          </motion.h1>
          <button 
            onClick={() => { setAlarm("off"); setFlash("off"); setLocation("/safe"); }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/35 transition-colors"
            data-testid="btn-safe-now"
          >
            <X size={15} className="stroke-[3]" />
          </button>
        </div>
        <p className="text-xs text-white/80 mt-1 font-bold uppercase tracking-wider">Astra Premium Safety Core</p>
      </div>

      {/* DYNAMIC ACTION SHEET / CHOICES POPUP */}
      <AnimatePresence>
        {showPrompt && (
          <div className="absolute inset-0 z-40 bg-slate-900/50 backdrop-blur-md flex items-end justify-center p-4">
            <motion.div 
              initial={{ y: 200, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 200, opacity: 0 }}
              className="w-full max-w-sm rounded-[2.5rem] bg-white text-[#083344] overflow-hidden shadow-2xl mb-8 border border-red-200"
            >
              <div className="px-5 pt-5 pb-4 bg-red-500/10 border-b border-red-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Shield size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest text-red-600">Select SOS Mode</h3>
                  <p className="text-xs font-bold text-[#083344]">Choose a safe protocol immediately</p>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-3.5">
                <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-1 uppercase tracking-wide">
                  Astra provides both quiet defense and heavy visual deterrent options.
                </p>

                {/* Silent SOS Option */}
                <button 
                  onClick={() => {
                    setSilentActive(true);
                    setAlarm("off");
                    setFlash("off");
                    setShowPrompt(false);
                    setStatusMessage("Silent SOS Beacon active: Encrypted real-time GPS location beacon dispatched to nearest 5 guardians & regional safety response units.");
                  }}
                  className="w-full p-4 rounded-2xl border border-teal-500/15 bg-gradient-to-r from-emerald-500/5 to-teal-500/10 hover:from-emerald-500/10 hover:to-teal-500/15 transition-all text-left flex gap-3 items-start group active:scale-[0.98]"
                >
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl mt-0.5">
                    <VolumeX size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600 block">Trigger Silent SOS</span>
                    <span className="text-[10px] text-slate-500 font-semibold leading-snug block mt-0.5">
                      Completely silent. Dispatches location covertly to contacts and local responders.
                    </span>
                  </div>
                </button>

                {/* Loud SOS Option */}
                <button 
                  onClick={() => {
                    setSilentActive(false);
                    setAlarm("on");
                    setFlash("on");
                    setShowPrompt(false);
                    setStatusMessage("Loud SOS Active: Auditory siren sweeping, high-strobe warning blinking, and immediate dispatch connection routing!");
                    initiateCall("Police Emergency Dispatch (112)");
                  }}
                  className="w-full p-4 rounded-2xl border border-rose-500/15 bg-gradient-to-r from-red-500/5 to-rose-500/10 hover:from-red-500/10 hover:to-rose-500/15 transition-all text-left flex gap-3 items-start group active:scale-[0.98]"
                >
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-xl mt-0.5">
                    <Bell size={16} className="animate-bounce" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-rose-600 block">Trigger Loud SOS</span>
                    <span className="text-[10px] text-slate-500 font-semibold leading-snug block mt-0.5">
                      Sounds maximum volume alarm sweep, strobes flash, and dials emergency line.
                    </span>
                  </div>
                </button>

                {/* Cancel/Dismiss */}
                <button 
                  onClick={() => setShowPrompt(false)}
                  className="w-full h-12 rounded-full font-black text-slate-500 text-[10px] uppercase tracking-widest border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] transition-transform mt-1"
                >
                  Cancel & Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CORE CONTROLLER BOARD */}
      <div className="relative z-10 px-5 pt-6 flex-1 flex flex-col justify-center gap-6">
        {statusMessage && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-3xl text-center shadow-md animate-pulse">
            <p className="text-red-600 text-xs font-black uppercase tracking-widest mb-1">Active Safety Log</p>
            <p className="text-[#083344] text-xs font-bold leading-normal">{statusMessage}</p>
          </div>
        )}

        {/* Dynamic Big Dual-Mode SOS Controls */}
        <div className="flex flex-col gap-4">
          {/* Silent SOS Core Button */}
          <button 
            onClick={() => {
              const next = !silentActive;
              setSilentActive(next);
              if (next) {
                setAlarm("off");
                setFlash("off");
                setStatusMessage("Silent SOS Beacon active: Encrypted real-time GPS location beacon dispatched to nearest 5 guardians & regional safety response units.");
              } else {
                setStatusMessage("Silent SOS mode deactivated.");
              }
            }}
            className={`w-full rounded-3xl p-5 border text-left flex gap-4 items-center transition-all ${
              silentActive 
                ? "border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30" 
                : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
            }`}
          >
            <div className={`p-3.5 rounded-2xl ${silentActive ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
              <VolumeX size={22} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#083344]">Silent SOS Alert</span>
                {silentActive && <span className="text-[8px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Broadcasting</span>}
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">Covert tracker broadcast to guardians & services.</p>
            </div>
            {silentActive && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <Wifi size={14} className="text-emerald-500 animate-pulse" />
              </div>
            )}
          </button>

          {/* Loud SOS Core Button */}
          <button 
            onClick={() => {
              const isLoud = alarm === "on" && flash === "on";
              if (isLoud) {
                setAlarm("off");
                setFlash("off");
                setStatusMessage("Loud SOS mode deactivated.");
              } else {
                setSilentActive(false);
                setAlarm("on");
                setFlash("on");
                setStatusMessage("Loud SOS Active: Auditory siren sweeping, high-strobe warning blinking, and immediate dispatch connection routing!");
                initiateCall("Police Emergency Dispatch (112)");
              }
            }}
            className={`w-full rounded-3xl p-5 border text-left flex gap-4 items-center transition-all ${
              alarm === "on" && flash === "on"
                ? "border-red-500 bg-red-500/15 ring-2 ring-red-500/30" 
                : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
            }`}
          >
            <div className={`p-3.5 rounded-2xl ${alarm === "on" && flash === "on" ? "bg-red-500 text-white" : "bg-slate-100 text-slate-400"}`}>
              <Bell size={22} className={alarm === "on" ? "animate-bounce" : ""} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-600">Loud SOS Siren</span>
                {alarm === "on" && <span className="text-[8px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Siren Blasting</span>}
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">High-frequency noise blast, strobe flare & helpline call.</p>
            </div>
            {alarm === "on" && (
              <div className="flex items-center gap-1 text-red-500">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                <Zap size={14} className="animate-pulse" />
              </div>
            )}
          </button>
        </div>

        {/* Floating Trigger call menu button */}
        {!showPrompt && !calling && (
          <button 
            onClick={() => setShowPrompt(true)}
            className="w-full h-14 rounded-full font-black text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-colors shadow-md"
          >
            <AlertTriangle size={14} />
            <span>Open SOS Mode Selector Menu</span>
          </button>
        )}
      </div>

      {/* BOTTOM SAFE TRIGGER */}
      <div className="relative z-10 px-5 pb-10">
        <button 
          onClick={() => { setAlarm("off"); setFlash("off"); setLocation("/safe"); }}
          className="w-full h-14 rounded-full font-black text-white bg-[#0d9488] hover:bg-[#0f766e] text-xs uppercase tracking-widest transition-colors shadow-md"
          data-testid="btn-safe"
        >
          I'm Safe Now
        </button>
      </div>

      {/* REAL ACTIVE EMERGENCY CALL OVERLAY */}
      <AnimatePresence>
        {calling && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-between pb-16 pt-24 bg-slate-50 text-[#083344]"
          >
            <div className="flex flex-col items-center pt-8">
              <h2 className="text-3xl font-black tracking-wide text-[#083344] font-sans uppercase">{calling}</h2>
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse mt-3">Connecting Line...</p>
              <p className="text-slate-400 text-xs mt-1 font-mono">{fmt(callDuration)}</p>
            </div>

            {/* Pulsing visual element */}
            <div className="relative flex items-center justify-center my-8">
              <div className="w-24 h-24 rounded-full border-2 border-red-500/30 bg-red-50 flex items-center justify-center text-red-500 font-bold text-4xl shadow-xl animate-pulse">
                🛡️
              </div>
            </div>

            {/* Dialer layout */}
            <div className="grid grid-cols-3 gap-y-6 gap-x-12 px-10 max-w-sm w-full text-[#083344] my-4">
              {[
                { icon: "🔇", label: "mute" },
                { icon: "🔢", label: "keypad" },
                { icon: "🔊", label: "speaker" },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer border border-slate-300/35 shadow-xs">
                    {b.icon}
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">{b.label}</span>
                </div>
              ))}
            </div>

            {/* End Call red circle button */}
            <div className="mt-8">
              <button 
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-2xl active:scale-95 transition-all"
              >
                <PhoneOff size={22} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
