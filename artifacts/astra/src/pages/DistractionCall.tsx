import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Phone, PhoneOff, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";

const CONTACTS = [
  { name: "Mom", number: "+91 98765 00001", avatar: "👩" },
  { name: "Sister", number: "+91 98765 00002", avatar: "👧" },
  { name: "Friend (Ananya)", number: "+91 98765 00003", avatar: "👱‍♀️" },
  { name: "Office Security", number: "+91 98765 00004", avatar: "👮" },
];

const CALL_SCRIPTS = [
  "Hey! Are you coming to pick me up? I'm at the junction near the mall...",
  "Yes Mom, I'm on my way. Can you stay on the line?",
  "Okay, I can see you. Just wait near the gate, I'll be there in 5 minutes.",
  "Alright, I'm walking toward the main road now.",
];

export function DistractionCall() {
  const [, setLocation] = useLocation();
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callActive) {
      interval = setInterval(() => {
        setCallDuration(d => d + 1);
        if (Math.random() > 0.7) setScriptIdx(i => (i + 1) % CALL_SCRIPTS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Distraction Call</h1>
          <p className="text-xs text-slate-400">Simulate a call to look occupied</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!callActive ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 p-4 pb-24"
          >
            <div className="rounded-2xl p-4 border border-primary/20 mb-6" style={{ background: "#111122" }}>
              <Volume2 size={16} className="text-primary mb-2"/>
              <p className="text-sm text-slate-300 leading-relaxed">
                This feature simulates a real incoming call with an automated voice. Use it if you feel followed or unsafe — it makes you look like you're actively talking to someone.
              </p>
            </div>

            <h3 className="text-sm font-semibold text-slate-300 mb-3">Choose who's "calling" you</h3>
            <div className="flex flex-col gap-2 mb-6">
              {CONTACTS.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedContact(c)}
                  data-testid={`contact-${c.name.toLowerCase().replace(/\s/g,"-")}`}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${selectedContact.name === c.name ? "border-primary bg-primary/10" : "border-white/10 bg-[#111827]"}`}
                >
                  <span className="text-2xl">{c.avatar}</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.number}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setCallActive(true); setCallDuration(0); }}
              data-testid="btn-start-call"
              className="w-full h-14 rounded-full font-semibold text-white flex items-center justify-center gap-2 shadow-lg shadow-green-900/30"
              style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}
            >
              <Phone size={20}/> Start Fake Call
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="call"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-between p-8 pb-24"
            style={{ background: "linear-gradient(to bottom, #0a1a0a, #0a0f1e)" }}
          >
            <div className="flex flex-col items-center mt-12">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4 border-2 border-green-500/30"
                style={{ background: "#0f2a0f" }}
              >
                {selectedContact.avatar}
              </motion.div>
              <h2 className="text-2xl font-bold text-white">{selectedContact.name}</h2>
              <p className="text-green-400 text-sm mt-1 font-medium">{fmt(callDuration)}</p>
              <p className="text-slate-400 text-xs mt-0.5">Simulated call in progress</p>
            </div>

            {/* Animated speech bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={scriptIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full rounded-2xl p-4 border border-white/10 mx-auto"
                style={{ background: "#111827" }}
              >
                <div className="flex gap-2 items-start">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 animate-pulse shrink-0"/>
                  <p className="text-sm text-slate-300 italic">{CALL_SCRIPTS[scriptIdx]}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => { setCallActive(false); setCallDuration(0); }}
              data-testid="btn-end-call"
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "#c0392b" }}
            >
              <PhoneOff size={28} className="text-white"/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
