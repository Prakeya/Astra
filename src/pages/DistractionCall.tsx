import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Phone, PhoneOff, Volume2, VolumeX, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { StarryBackground } from "@/components/StarryBackground";

const CONTACTS = [
  { name: "Mom", number: "+91 98765 00001", initials: "M" },
  { name: "Sister", number: "+91 98765 00002", initials: "S" },
  { name: "Ananya", number: "+91 98765 00003", initials: "A" },
  { name: "Dad", number: "+91 98765 00005", initials: "D" },
  { name: "Office Security (Roy)", number: "+91 98765 00004", initials: "SR" },
];

const SCRIPTS: Record<string, string[]> = {
  "Mom": [
    "Hey... are you almost back? I'm just sitting here in the living room... was thinking of making some tea. Let me know when you're getting close, okay?",
    "Alright, yeah... don't worry about it at all. I'll just stay right here on the line with you, we can just chat. How was your day?",
    "Mmhmm, yeah, that makes total sense. By the way, guess who called me earlier today? It was so unexpected...",
    "Yeah... okay, you're almost there! Just keep walking, no rush. Call me as soon as you step inside, okay? Talk to you in a bit.",
  ],
  "Sister": [
    "Oh hey! Where are you? We're literally waiting to start the movie, hurry up!",
    "Ah, okay. No worries, I can stay on the line. Just walk at a comfortable pace, I'll keep babbling to keep you company!",
    "Wait... seriously? Oh my gosh, that is hilarious. You have to tell me the full story when you get back.",
    "Perfect, keep going! I'm watching your location on the map, you're super close. See you in a minute!",
  ],
  "Ananya": [
    "Hey! Just heading out now, where are you exactly? I'm walking past the coffee shop...",
    "Ah, cool. I'll meet you right by the main gate in like five minutes. Just walk slowly, no need to run.",
    "Yeah, totally... I'm just heading down the sidewalk now. It's actually a pretty nice evening out, isn't it?",
    "Awesome, I can see you! I'm keeping the map open, just stay on the line until we cross paths. See ya!",
  ],
  "Dad": [
    "Hey, just checking in. Are you on your way home now? Let me know if you need me to walk down and meet you at the corner.",
    "Okay, sounds good. I'll stay on the line with you. Make sure you stay on the main lighted path.",
    "Right, right. I was just reading that article you sent me. It was pretty interesting, actually.",
    "Perfect, keep moving. I'm right here. Call out if you need anything, I'm watching out for you.",
  ],
  "Office Security (Roy)": [
    "Hello, this is Officer Roy from the main desk. Confirming your safety patrol vehicle is currently stationed near Gate 2.",
    "Yes, ma'am. I am holding the direct line with you as requested until you safely clear the avenue.",
    "Understood. I have your sector pulled up on the security monitors right now. Everything is clear.",
    "Correct, keep proceeding along the illuminated pathway. Main gate dispatch has been notified. Have a good night.",
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Preload system speech voices and listen to changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      const updateVoices = () => {
        if (window.speechSynthesis) {
          setVoices(window.speechSynthesis.getVoices());
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => { synthRef.current?.cancel(); };
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const speak = (text: string) => {
    if (muted || !window.speechSynthesis) return;
    
    // Always cancel ongoing speech to prevent stutter/shaking
    window.speechSynthesis.cancel();
    
    const naturalSpacedText = text.replace(/\.\.\./g, ", , ").replace(/—/g, ", ");
    const utt = new SpeechSynthesisUtterance(naturalSpacedText);
    
    const isMale = selectedContact.name === "Dad" || selectedContact.name === "Office Security (Roy)";
    
    let selectedVoice: SpeechSynthesisVoice | null = null;
    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    
    if (isMale) {
      // Look for a male voice
      selectedVoice = currentVoices.find(v => 
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("male") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("ravi") ||
        v.name.toLowerCase().includes("george")
      ) || null;
      utt.pitch = 0.75; // Lower pitch for male voice realism
    } else {
      // Look for a female voice
      selectedVoice = currentVoices.find(v => 
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("karen") ||
        v.name.toLowerCase().includes("hazel") ||
        v.name.toLowerCase().includes("veena") ||
        v.name.toLowerCase().includes("heera") ||
        v.name.toLowerCase().includes("google us english")
      ) || null;
      utt.pitch = 1.35; // Higher pitch for female voice realism
    }
    
    if (selectedVoice) {
      utt.voice = selectedVoice;
    }
    
    utt.rate = 0.95; // Extremely natural human cadence
    
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    
    // Short delay gives the audio driver thread enough headroom to release, avoiding speech stutter (shaking/looping)
    setTimeout(() => {
      if (window.speechSynthesis) {
        window.speechSynthesis.speak(utt);
      }
    }, 120);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let scriptInterval: NodeJS.Timeout;
    let initialDelay: NodeJS.Timeout;

    if (callActive) {
      const scripts = SCRIPTS[selectedContact.name] || SCRIPTS["Ananya"];
      initialDelay = setTimeout(() => speak(scripts[0]), 1200);

      interval = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);

      // Slower interval so dialogue can complete naturally without feeling rushed or getting stuck
      scriptInterval = setInterval(() => {
        setScriptIdx(i => {
          const next = (i + 1) % scripts.length;
          speak(scripts[next]);
          return next;
        });
      }, 14000);
    }

    return () => { 
      clearTimeout(initialDelay);
      clearInterval(interval); 
      clearInterval(scriptInterval); 
    };
  }, [callActive, muted, selectedContact, voices]);

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

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#e0f2fe] relative overflow-hidden text-[#083344]">
      {/* Cinematic Dreamscape Backdrop */}
      <StarryBackground />

      {/* Top Header - Glassmorphic light style (only visible when not in active call) */}
      {!callActive && (
        <div className="flex items-center gap-3 px-5 py-4 pt-12 border-b border-[#085a70]/10 bg-white/45 backdrop-blur-md relative z-10">
          <button onClick={() => setLocation("/home")} className="p-2.5 rounded-2xl bg-white/70 border border-[#085a70]/10 shadow-sm hover:bg-white transition-colors" data-testid="btn-back">
            <ArrowLeft size={14} className="text-[#083344] stroke-[3]" />
          </button>
          <div>
            <h1 className="text-base font-black uppercase tracking-wider text-[#083344] font-sans">Discrete Call</h1>
            <p className="text-[10px] text-[#085a70]/80 font-black uppercase tracking-widest">Active Safety Line</p>
          </div>
          <div className="ml-auto w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse border border-teal-300" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {!callActive ? (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 p-5 pb-24 flex flex-col gap-5 overflow-y-auto relative z-10">
            
            {/* Guide Info panel */}
            <div className="rounded-3xl p-4 border border-[#085a70]/10 shadow-sm flex gap-3 items-start bg-white/55 backdrop-blur-md">
              <Shield size={18} className="text-[#0d9488] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#083344]/80 leading-relaxed font-bold">
                Triggers an organic, responsive phone call to keep you securely connected. Astra plays lifelike speech out loud so that potential tailgaters think you are talking with someone.
              </p>
            </div>

            <h3 className="text-[10px] font-black text-[#083344]/70 uppercase tracking-widest">Select Contact</h3>
            
            <div className="flex flex-col gap-2.5">
              {CONTACTS.map(c => (
                <button 
                  key={c.name} 
                  onClick={() => setSelectedContact(c)}
                  data-testid={`contact-${c.name.toLowerCase().replace(/\s/g,"-")}`}
                  className={`flex items-center gap-3.5 p-4 rounded-3xl border transition-all ${
                    selectedContact.name === c.name 
                      ? "border-[#0d9488] bg-[#0d9488]/10 shadow-sm" 
                      : "border-[#085a70]/10 bg-white/45 hover:bg-white/60"
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white border border-[#085a70]/10 flex items-center justify-center font-black text-xs text-[#085a70] shrink-0">
                    {c.initials}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-xs font-black text-[#083344] truncate">{c.name}</div>
                    <div className="text-[10px] text-[#085a70]/60 font-bold font-mono mt-0.5">{c.number}</div>
                  </div>
                  {selectedContact.name === c.name && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0d9488]" />
                  )}
                </button>
              ))}
            </div>

            {/* Dial Button */}
            <button 
              onClick={startCall} 
              data-testid="btn-start-call"
              className="w-full h-14 rounded-full font-black text-white flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all border border-teal-500/10 uppercase tracking-widest text-xs mt-auto"
              style={{ 
                background: "linear-gradient(135deg, #0d9488, #085a70)",
                boxShadow: "0 10px 20px -8px rgba(8,90,112,0.35)"
              }}
            >
              <Phone size={14} className="fill-current" />
              <span>Call Now</span>
            </button>
            
          </motion.div>
        ) : (
          <motion.div key="call" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-between pb-16 pt-20 relative z-50 bg-slate-50 text-[#083344]">

            {/* Top iOS Header space spacing */}
            <div className="flex flex-col items-center pt-8">
              <h2 className="text-3xl font-black text-[#083344] font-sans tracking-wide mb-1 uppercase">{selectedContact.name}</h2>
              <p className="text-[#085a70]/70 text-xs font-black uppercase tracking-widest mt-1.5">
                mobile
              </p>
              <p className="text-slate-400 text-xs mt-1.5 font-mono font-bold">{fmt(callDuration)}</p>
            </div>

            {/* Pulsing clean circular avatar */}
            <div className="my-8 relative flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border border-slate-200 bg-white flex items-center justify-center font-black text-3xl text-[#085a70] shadow-md">
                {selectedContact.initials}
              </div>
              {speaking && (
                <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-teal-500 animate-ping opacity-20 pointer-events-none" />
              )}
            </div>

            {/* Realistic phone grid interface of standard call features */}
            <div className="grid grid-cols-3 gap-y-8 gap-x-12 px-10 my-4 max-w-sm w-full text-[#083344]">
              <div className="flex flex-col items-center gap-2">
                <button onClick={() => { setMuted(!muted); if (!muted) window.speechSynthesis?.cancel(); }} 
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xs border border-slate-300/35 ${muted ? "bg-[#0d9488] text-white border-[#0d9488]" : "bg-white hover:bg-slate-100"}`}>
                  {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">{muted ? "unmute" : "mute"}</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center transition-all border border-slate-300/35 shadow-xs">
                  <span className="text-xl">🔢</span>
                </button>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">keypad</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center transition-all border border-slate-300/35 shadow-xs">
                  <span className="text-xl">🔊</span>
                </button>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">speaker</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center transition-all border border-slate-300/35 shadow-xs">
                  <span className="text-xl">➕</span>
                </button>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">add call</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center transition-all border border-slate-300/35 shadow-xs">
                  <span className="text-xl">📹</span>
                </button>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">FaceTime</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button className="w-16 h-16 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center transition-all border border-slate-300/35 shadow-xs">
                  <span className="text-xl">👤</span>
                </button>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">contacts</span>
              </div>
            </div>

            {/* End Call red bar */}
            <div className="mt-10 flex flex-col items-center justify-center w-full">
              <button 
                onClick={endCall} 
                data-testid="btn-end-call"
                className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-500 shadow-lg active:scale-95 transition-all"
              >
                <PhoneOff size={24} className="text-white" />
              </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
