import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Shield, AlertCircle, Sparkles, MessageSquare, Compass, ShieldAlert } from "lucide-react";
import { getComplaints, type Complaint } from "@/lib/safetyStore";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export function AISafetyAssistantDrawer({ isOpen, onClose, initialPrompt }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-welcome",
      sender: "ai",
      text: "Hello! I am Astra's AI Safety Advisor. I monitor real-time community complaints, risk hotspots, and emergency routes to keep you safe. How can I assist you?",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const liveComplaints: Complaint[] = getComplaints();
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          complaints: liveComplaints,
          userLocation: "Current Detected Location",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data.reply || "I am analyzing nearby perimeter data. Stay on well-lit main roads.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Assistant request failed");
      }
    } catch (err) {
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "I am constantly scanning the community safety database. Always prioritize well-lit, populated paths and keep your SOS button accessible.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="w-full max-w-md h-full bg-[#082f49] text-white flex flex-col shadow-2xl border-l border-cyan-500/20"
        >
          {/* Header */}
          <div className="p-4 bg-[#0369a1]/40 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-wider text-cyan-100 flex items-center gap-2">
                  Astra AI Advisor
                  <span className="text-[9px] bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 px-2 py-0.5 rounded-full font-extrabold uppercase">
                    Live Gemini
                  </span>
                </h3>
                <p className="text-[10px] text-cyan-200/70 font-semibold">Real-time Safety Intelligence</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-cyan-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-gradient-to-b from-[#082f49] to-[#0c4a6e]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                    m.sender === "user"
                      ? "bg-cyan-500 text-slate-950 font-semibold rounded-br-none shadow-md"
                      : "bg-slate-900/90 border border-cyan-500/20 text-slate-100 rounded-bl-none shadow-lg"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-cyan-300/50 mt-1 font-mono font-semibold px-1">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-slate-900/80 rounded-2xl border border-cyan-500/20 text-cyan-300 text-xs w-fit">
                <Sparkles size={14} className="animate-spin text-cyan-400" />
                <span className="font-semibold text-[11px] animate-pulse">Analyzing community safety records...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="p-2.5 bg-slate-950/40 border-t border-cyan-500/10 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => handleSend("How is the safety score computed?")}
              className="text-[10px] bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/20 text-cyan-200 px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-semibold"
            >
              🛡 Explain Safety Score
            </button>
            <button
              onClick={() => handleSend("Are there any active danger hotspots near me?")}
              className="text-[10px] bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/20 text-cyan-200 px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-semibold"
            >
              ⚠️ Check Hotspots
            </button>
            <button
              onClick={() => handleSend("How does the Safe Route engine select safe paths?")}
              className="text-[10px] bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/20 text-cyan-200 px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-semibold"
            >
              🗺 Safe Route Logic
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950/80 border-t border-cyan-500/20 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask safety questions or route recommendations..."
              className="flex-1 bg-slate-900 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 rounded-xl font-bold transition-all shadow-md shrink-0 flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
