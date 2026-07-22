import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

const TRIGGER_PHRASES = ["astra help", "astra emergency", "astra sos", "help me astra"];

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useVoiceActivation(enabled: boolean) {
  const [, setLocation] = useLocation();
  const [triggered, setTriggered] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const triggerSOS = useCallback(() => {
    setTriggered(true);
    setTimeout(() => {
      setTriggered(false);
      setLocation("/sos");
    }, 1500);
  }, [setLocation]);

  const startListening = useCallback(() => {
    if (!enabledRef.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    try {
      const recognition = new SR();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (e: SpeechRecognitionEvent) => {
        let transcript = "";
        for (let i = e.results.length - 1; i >= 0; i--) {
          transcript = e.results[i][0].transcript.toLowerCase().trim();
          if (transcript) break;
        }
        if (transcript) setLastHeard(transcript);
        const found = TRIGGER_PHRASES.some(phrase => transcript.includes(phrase));
        if (found) {
          recognition.stop();
          triggerSOS();
        }
      };

      recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
        if (e.error !== "no-speech" && e.error !== "aborted") {
          setListening(false);
        }
      };

      recognition.onend = () => {
        setListening(false);
        if (enabledRef.current) {
          restartTimerRef.current = setTimeout(startListening, 500);
        }
      };

      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [triggerSOS]);

  useEffect(() => {
    if (enabled) {
      startListening();
    } else {
      recognitionRef.current?.stop();
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      setListening(false);
    }
    return () => {
      recognitionRef.current?.stop();
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    };
  }, [enabled, startListening]);

  return { listening, triggered, lastHeard };
}

export function VoiceTriggeredOverlay({ triggered }: { triggered: boolean }) {
  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "rgba(10,5,5,0.97)" }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="w-32 h-32 rounded-full flex items-center justify-center mb-6"
            style={{ background: "rgba(200,30,50,0.25)", border: "2px solid rgba(200,30,50,0.6)" }}
          >
            <Mic size={56} className="text-red-400" />
          </motion.div>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-white mb-2"
          >
            SOS Triggered
          </motion.h2>
          <p className="text-red-300 text-sm tracking-widest uppercase">Voice command detected</p>
          <motion.div
            className="mt-6 h-1 rounded-full bg-red-500"
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            style={{ maxWidth: 240 }}
          />
          <p className="text-slate-400 text-xs mt-3">Alerting your guardians now…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function VoiceStatusPill({ listening }: { listening: boolean }) {
  if (!listening) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ background: "rgba(15,25,40,0.9)", border: "1px solid rgba(96,165,250,0.3)" }}
    >
      <motion.div
        className="w-2 h-2 rounded-full bg-blue-400"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <span className="text-xs text-blue-300 font-medium">Listening</span>
    </motion.div>
  );
}
