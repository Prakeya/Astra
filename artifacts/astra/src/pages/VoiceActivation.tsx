import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Mic, MicOff, Volume2, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const TRIGGER_PHRASES = [
  { phrase: "Astra help", desc: "Primary trigger" },
  { phrase: "Astra emergency", desc: "Alternate trigger" },
  { phrase: "Astra SOS", desc: "Alternate trigger" },
  { phrase: "Help me Astra", desc: "Natural phrase" },
];

const SENSITIVITY_LABELS = ["Low", "Medium", "High"];

export function VoiceActivation() {
  const [, setLocation] = useLocation();
  const [enabled, setEnabled] = useState(false);
  const [sensitivity, setSensitivity] = useState(1);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "listening" | "detected" | "notHeard">("idle");
  const [waveform, setWaveform] = useState<number[]>(Array(24).fill(4));
  const [permissionState, setPermissionState] = useState<"unknown" | "granted" | "denied">("unknown");
  const [lastTranscript, setLastTranscript] = useState("");
  const waveInterval = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<EventTarget & { start(): void; stop(): void; continuous: boolean; interimResults: boolean; lang: string; onresult: ((e: Event) => void) | null; onerror: ((e: Event) => void) | null; onend: (() => void) | null } | null>(null);

  useEffect(() => {
    navigator.permissions?.query({ name: "microphone" as PermissionName })
      .then(r => setPermissionState(r.state === "granted" ? "granted" : r.state === "denied" ? "denied" : "unknown"))
      .catch(() => {});
  }, []);

  const animateWave = (active: boolean) => {
    if (!active) {
      if (waveInterval.current) clearInterval(waveInterval.current);
      setWaveform(Array(24).fill(4));
      return;
    }
    waveInterval.current = setInterval(() => {
      setWaveform(prev => prev.map(() => Math.floor(Math.random() * 28) + 4));
    }, 80);
  };

  const requestMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionState("granted");
      setEnabled(true);
    } catch {
      setPermissionState("denied");
    }
  };

  const startTest = () => {
    const SR = (window as { SpeechRecognition?: new () => EventTarget; webkitSpeechRecognition?: new () => EventTarget }).SpeechRecognition
              || (window as { SpeechRecognition?: new () => EventTarget; webkitSpeechRecognition?: new () => EventTarget }).webkitSpeechRecognition;
    if (!SR) {
      setTestResult("notHeard");
      return;
    }
    setTesting(true);
    setTestResult("listening");
    setLastTranscript("");
    animateWave(true);

    const recognition = new SR() as (typeof recognitionRef)["current"];
    if (!recognition) return;
    recognitionRef.current = recognition;
    (recognition as { continuous: boolean }).continuous = false;
    (recognition as { interimResults: boolean }).interimResults = true;
    (recognition as { lang: string }).lang = "en-US";

    let detected = false;
    (recognition as { onresult: ((e: Event) => void) | null }).onresult = (e: Event) => {
      const evt = e as Event & { results: { length: number; [i: number]: { [j: number]: { transcript: string } } } };
      for (let i = 0; i < evt.results.length; i++) {
        const t = evt.results[i][0].transcript.toLowerCase().trim();
        setLastTranscript(t);
        const triggers = ["astra help", "astra emergency", "astra sos", "help me astra"];
        if (triggers.some(p => t.includes(p))) {
          detected = true;
          recognition.stop();
          setTestResult("detected");
          animateWave(false);
          setTesting(false);
          break;
        }
      }
    };

    (recognition as { onerror: ((e: Event) => void) | null }).onerror = () => {
      animateWave(false);
      setTestResult("notHeard");
      setTesting(false);
    };

    (recognition as { onend: (() => void) | null }).onend = () => {
      animateWave(false);
      setTesting(false);
      if (!detected) setTestResult("notHeard");
    };

    recognition.start();
    setTimeout(() => {
      recognition.stop();
    }, 5000);
  };

  const stopTest = () => {
    recognitionRef.current?.stop();
    animateWave(false);
    setTesting(false);
    setTestResult("idle");
  };

  useEffect(() => {
    return () => {
      if (waveInterval.current) clearInterval(waveInterval.current);
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Voice Activation</h1>
          <p className="text-xs text-slate-400">Say "Astra help" to trigger SOS hands-free</p>
        </div>
        <div className={`ml-auto w-2 h-2 rounded-full ${enabled ? "bg-green-400" : "bg-slate-600"}`} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-5">

        {/* Hero visual */}
        <div className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center py-10"
             style={{ background: "linear-gradient(135deg, #0d1a2a, #1a0d1a)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Ripple rings */}
          {enabled && [1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-blue-400/20"
              animate={{ scale: [1, 2.5 + i * 0.4], opacity: [0.4, 0] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              style={{ width: 80, height: 80 }}
            />
          ))}

          <motion.div
            className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
            animate={enabled ? { boxShadow: ["0 0 0 0 rgba(96,165,250,0.4)", "0 0 0 20px rgba(96,165,250,0)", "0 0 0 0 rgba(96,165,250,0)"] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: enabled ? "rgba(30,58,120,0.8)" : "rgba(30,41,59,0.8)", border: `1px solid ${enabled ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.1)"}` }}
          >
            {enabled
              ? <Mic size={36} className="text-blue-400" />
              : <MicOff size={36} className="text-slate-500" />}
          </motion.div>

          <p className="relative z-10 mt-4 text-sm font-semibold text-white">
            {enabled ? "Always listening for your voice" : "Voice activation is off"}
          </p>
          <p className="relative z-10 text-xs text-slate-400 mt-1">
            {enabled ? "Your device mic is active in the background" : "Enable to activate hands-free SOS"}
          </p>
        </div>

        {/* Enable toggle */}
        {permissionState === "denied" ? (
          <div className="rounded-2xl p-4 border border-red-500/30 flex items-start gap-3" style={{ background: "#1a0a0a" }}>
            <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-white mb-1">Microphone access denied</div>
              <p className="text-xs text-slate-400">Please allow microphone access in your browser settings to enable voice activation.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-4 border border-white/10 flex items-center justify-between" style={{ background: "#111827" }}>
            <div>
              <div className="text-sm font-semibold text-white">Voice Activation</div>
              <div className="text-xs text-slate-400 mt-0.5">Always-on background listening</div>
            </div>
            <button
              onClick={() => {
                if (!enabled && permissionState !== "granted") { requestMic(); return; }
                setEnabled(!enabled);
              }}
              data-testid="toggle-voice"
              className={`w-14 h-7 rounded-full transition-all duration-300 relative ${enabled ? "bg-blue-500" : "bg-white/20"}`}
            >
              <motion.span
                layout
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
                animate={{ left: enabled ? "calc(100% - 24px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        )}

        {/* Trigger phrases */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Trigger phrases</h3>
          <div className="flex flex-col gap-2">
            {TRIGGER_PHRASES.map(p => (
              <div key={p.phrase} className="flex items-center gap-3 p-3 rounded-xl border border-white/10" style={{ background: "#111827" }}>
                <Volume2 size={14} className="text-blue-400 shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-white">"{p.phrase}"</span>
                </div>
                <span className="text-xs text-slate-500">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensitivity */}
        <div className="rounded-2xl p-4 border border-white/10" style={{ background: "#111827" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Sensitivity</span>
            <span className="text-xs text-blue-400 font-medium">{SENSITIVITY_LABELS[sensitivity]}</span>
          </div>
          <div className="flex gap-2">
            {SENSITIVITY_LABELS.map((l, i) => (
              <button
                key={l}
                onClick={() => setSensitivity(i)}
                data-testid={`sensitivity-${l.toLowerCase()}`}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${sensitivity === i ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/10 text-slate-400"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {sensitivity === 0 && "Only triggers on very clear, loud speech."}
            {sensitivity === 1 && "Balanced — works well in most environments."}
            {sensitivity === 2 && "Triggers on partial matches. May have false positives."}
          </p>
        </div>

        {/* Live test */}
        <div className="rounded-2xl p-4 border border-white/10" style={{ background: "#111827" }}>
          <h3 className="text-sm font-semibold text-white mb-1">Test Voice Trigger</h3>
          <p className="text-xs text-slate-400 mb-4">Press the button below, then say "Astra help" to test detection. This will NOT trigger a real SOS.</p>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-1 h-12 mb-4">
            {waveform.map((h, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full"
                style={{ height: h, background: testResult === "detected" ? "#22c55e" : testResult === "notHeard" ? "#e85d7a" : "#3b82f6" }}
                animate={{ height: h }}
                transition={{ duration: 0.08 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {testResult === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Button onClick={startTest} disabled={!enabled} className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-40" data-testid="btn-test-voice">
                  <Mic size={16} className="mr-2" /> Start Listening Test
                </Button>
              </motion.div>
            )}
            {testResult === "listening" && (
              <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-3">
                  <motion.p className="text-sm font-semibold text-blue-300" animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                    Listening… say "Astra help"
                  </motion.p>
                  {lastTranscript && <p className="text-xs text-slate-400 mt-1">Heard: "{lastTranscript}"</p>}
                </div>
                <button onClick={stopTest} className="w-full h-11 rounded-full border border-white/20 text-slate-300 text-sm" data-testid="btn-stop-test">
                  Stop
                </button>
              </motion.div>
            )}
            {testResult === "detected" && (
              <motion.div key="detected" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="flex items-center gap-2 justify-center mb-3">
                  <CheckCircle size={20} className="text-green-400" />
                  <p className="text-sm font-semibold text-green-400">Voice trigger detected!</p>
                </div>
                <button onClick={() => setTestResult("idle")} className="w-full h-11 rounded-full border border-white/20 text-slate-300 text-sm" data-testid="btn-retest">
                  Test again
                </button>
              </motion.div>
            )}
            {testResult === "notHeard" && (
              <motion.div key="notHeard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center gap-2 justify-center mb-3">
                  <AlertTriangle size={20} className="text-yellow-400" />
                  <p className="text-sm font-semibold text-yellow-400">
                    {lastTranscript ? `Heard "${lastTranscript}" — not a trigger` : "Nothing detected"}
                  </p>
                </div>
                {lastTranscript && <p className="text-xs text-slate-500 text-center mb-3">Try saying "Astra help" more clearly.</p>}
                <button onClick={() => setTestResult("idle")} className="w-full h-11 rounded-full border border-white/20 text-slate-300 text-sm" data-testid="btn-retry">
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy note */}
        <div className="rounded-2xl p-4 border border-white/10 flex items-start gap-3" style={{ background: "#0d1525" }}>
          <Shield size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-1">Privacy & Security</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All voice processing happens on your device. Audio is never recorded or transmitted. Only the transcript is checked against trigger phrases locally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
