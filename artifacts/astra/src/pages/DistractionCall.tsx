import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Phone, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const CONTACTS = [
  { name: "Mom", number: "+91 98765 00001", avatar: "👩" },
  { name: "Sister", number: "+91 98765 00002", avatar: "👧" },
  { name: "Friend (Ananya)", number: "+91 98765 00003", avatar: "👱‍♀️" },
  { name: "Office Security", number: "+91 98765 00004", avatar: "👮" },
];

const SCRIPTS: Record<string, string[]> = {
  "Mom": [
    "Hey beta, where are you? I was waiting...",
    "Okay, okay — don't worry. I'm right here on the phone.",
    "Yes I can stay on the call. Just keep walking, I'm with you.",
    "You're almost there. Call me when you reach, okay?",
  ],
  "Sister": [
    "Hey! Are you coming? We've been waiting.",
    "Okay, stay on the line. I'll keep talking.",
    "Tell me about your day. I'm here, don't worry.",
    "Almost! I can see you on Google Maps, keep going!",
  ],
  "Friend (Ananya)": [
    "Hey! Are you coming to pick me up? I'm at the junction...",
    "Yes, I can see you. Just wait near the gate, I'll be there in 5.",
    "Okay, I'm walking toward the main road now.",
    "Alright — I'm tracking your location. Keep talking!",
  ],
  "Office Security": [
    "Hello, this is security. Your cab is at Gate 2.",
    "Okay, I'll stay on the line until you reach.",
    "Roger that — I can see the area on CCTV. All clear.",
    "Stay on the main road. I've informed patrol.",
  ],
};

export function DistractionCall() {
  const [, setLocation] = useLocation();
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [selectedContact, setSelectedContact] = useState(CONTACTS[0]);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const speak = (text: string) => {
    if (muted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Veena") || v.lang === "en-IN");
    if (femaleVoice) utt.voice = femaleVoice;
    utt.rate = 0.92;
    utt.pitch = 1.1;
    utt.volume = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => { synthRef.current?.cancel(); };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callActive) {
      const scripts = SCRIPTS[selectedContact.name] || SCRIPTS["Friend (Ananya)"];
      // Speak first line immediately
      setTimeout(() => speak(scripts[0]), 800);

      interval = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);

      const scriptInterval = setInterval(() => {
        setScriptIdx(i => {
          const next = (i + 1) % scripts.length;
          speak(scripts[next]);
          return next;
        });
      }, 8000);

      return () => { clearInterval(interval); clearInterval(scriptInterval); };
    }
  }, [callActive, muted, selectedContact]);

  const startCall = () => {
    setCallActive(true);
    setCallDuration(0);
    setScriptIdx(0);
  };

  const endCall = () => {
    setCallActive(false);
    setCallDuration(0);
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const scripts = SCRIPTS[selectedContact.name] || SCRIPTS["Friend (Ananya)"];

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Distraction Call</h1>
          <p className="text-xs text-slate-400">Simulate a call — with real voice</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!callActive ? (
          <motion.div key="setup" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="flex-1 p-4 pb-24">
            <div className="rounded-2xl p-4 border border-primary/20 mb-6" style={{ background:"#111122" }}>
              <Volume2 size={16} className="text-primary mb-2"/>
              <p className="text-sm text-slate-300 leading-relaxed">
                This starts a <strong className="text-white">real voice call simulation</strong> — your phone will speak the other person's lines out loud using text-to-speech. Use it if you feel followed or unsafe.
              </p>
            </div>

            <h3 className="text-sm font-semibold text-slate-300 mb-3">Choose who's "calling" you</h3>
            <div className="flex flex-col gap-2 mb-6">
              {CONTACTS.map(c => (
                <button key={c.name} onClick={() => setSelectedContact(c)}
                  data-testid={`contact-${c.name.toLowerCase().replace(/\s/g,"-")}`}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${selectedContact.name === c.name ? "border-primary bg-primary/10" : "border-white/10 bg-[#111827]"}`}>
                  <span className="text-2xl">{c.avatar}</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.number}</div>
                  </div>
                  {selectedContact.name === c.name && <div className="ml-auto w-2 h-2 rounded-full bg-primary"/>}
                </button>
              ))}
            </div>

            <button onClick={startCall} data-testid="btn-start-call"
              className="w-full h-14 rounded-full font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
              style={{ background:"linear-gradient(135deg, #166534, #15803d)" }}>
              <Phone size={20}/> Start Fake Call (with voice)
            </button>
          </motion.div>
        ) : (
          <motion.div key="call" initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
            className="flex-1 flex flex-col items-center justify-between pb-12"
            style={{ background:"linear-gradient(to bottom, #050f05, #0a0f1e)" }}>

            {/* Caller info */}
            <div className="flex flex-col items-center pt-14">
              <motion.div animate={{ scale: speaking ? [1,1.1,1] : 1 }}
                transition={{ duration:0.4, repeat: speaking ? Infinity : 0 }}
                className="w-28 h-28 rounded-full flex items-center justify-center text-6xl mb-4 border-2"
                style={{ background:"#0f2a0f", borderColor: speaking ? "rgba(34,197,94,0.6)" : "rgba(34,197,94,0.2)" }}>
                {selectedContact.avatar}
              </motion.div>
              <h2 className="text-2xl font-bold text-white">{selectedContact.name}</h2>
              <p className="text-green-400 text-base font-semibold mt-1">{fmt(callDuration)}</p>
              {speaking && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="flex items-center gap-1.5 mt-2">
                  {[0,1,2,3].map(i => (
                    <motion.div key={i} className="w-1 rounded-full bg-green-400"
                      animate={{ height:[8,20,8] }} transition={{ duration:0.5, delay:i*0.1, repeat:Infinity }}/>
                  ))}
                  <span className="text-xs text-green-400 ml-1">Speaking…</span>
                </motion.div>
              )}
            </div>

            {/* Speech bubble */}
            <AnimatePresence mode="wait">
              <motion.div key={scriptIdx} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10 }} className="w-full px-6 my-4">
                <div className="rounded-2xl p-4 border border-white/10" style={{ background:"#111827" }}>
                  <div className="flex gap-2 items-start">
                    <span className="text-lg shrink-0">{selectedContact.avatar}</span>
                    <p className="text-sm text-slate-200 italic leading-relaxed">"{scripts[scriptIdx]}"</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 w-full px-6">
              {/* Mute toggle */}
              <button onClick={() => { setMuted(m => !m); if (!muted) window.speechSynthesis?.cancel(); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${muted ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-white/15 text-slate-300"}`}>
                {muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
                {muted ? "Voice muted" : "Voice on"}
              </button>

              {/* End call */}
              <button onClick={endCall} data-testid="btn-end-call"
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                style={{ background:"#c0392b" }}>
                <PhoneOff size={28} className="text-white"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
