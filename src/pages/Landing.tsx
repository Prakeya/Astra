import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Shield, ArrowRight, Star, MapPin, Users, Sparkles, ShieldAlert } from "lucide-react";
import { StarryBackground } from "@/components/StarryBackground";

export function Landing() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden bg-[#e0f2fe]">
      {/* Cinematic Dreamscape Backdrop */}
      <StarryBackground />

      {/* Elegant Ambient Glowing Ring in center of Sky */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating elegant glassmorphic indicators with warm glow */}
      <motion.div
        className="absolute top-24 left-6 w-12 h-12 rounded-2xl bg-white/55 border border-cyan-400/20 backdrop-blur-md shadow-lg shadow-cyan-900/5 flex items-center justify-center z-10"
        animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield size={20} className="text-[#085a70] drop-shadow-[0_0_4px_rgba(8,90,112,0.3)]" />
      </motion.div>
      <motion.div
        className="absolute top-36 right-8 w-11 h-11 rounded-2xl bg-white/55 border border-teal-400/20 backdrop-blur-md shadow-lg shadow-teal-900/5 flex items-center justify-center z-10"
        animate={{ y: [4, -4, 4], rotate: [1.5, -1.5, 1.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <MapPin size={18} className="text-[#0e7490] drop-shadow-[0_0_4px_rgba(14,116,144,0.3)]" />
      </motion.div>

      {/* Main content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-20 pb-4">
        
        {/* Sleek App Emblem with Soft Glow */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="mb-6 relative"
        >
          {/* Outer glowing halo */}
          <motion.div 
            className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-teal-400 to-cyan-400 opacity-20 blur-lg"
            animate={{ scale: [0.96, 1.06, 0.96], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#085a70] via-[#0e7490] to-[#085a70] shadow-xl shadow-[#083344]/15 border border-cyan-300/30 relative overflow-hidden flex items-center justify-center">
            <div className="absolute top-1.5 right-1.5 animate-pulse">
              <Sparkles size={10} className="text-white/40" />
            </div>
            <span className="text-4xl font-extrabold text-white tracking-tighter" style={{ fontFamily: "'Outfit', sans-serif" }}>A</span>
          </div>
        </motion.div>

        {/* Title & Slogan Header area */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center w-full max-w-sm px-2"
            >
              {/* Pill badge matching reference top badge */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/40 border border-[#085a70]/10 backdrop-blur-sm mb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#085a70]">
                  Where Protection Meets Peace of Mind
                </span>
              </div>

              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-3xl sm:text-4xl font-black text-[#083344] mb-2 tracking-tight font-sans leading-none"
              >
                Hello, I am Astra
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-[#0d9488] font-black text-sm uppercase tracking-widest mb-3"
              >
                You are never alone.
              </motion.p>
              
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-xs font-semibold tracking-wide text-[#0f766e] max-w-xs leading-relaxed">
                      Astra coordinates real-time safety heatmaps and local dispatch guards along your route.
                    </p>
                    <div className="mt-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#0d9488] to-[#085a70] opacity-40" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature grid */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-2 gap-2 w-full max-w-xs mt-6"
            >
              {[
                { icon: <Shield size={12} className="text-[#0d9488]" />, label: "Safety heatmaps" },
                { icon: <MapPin size={12} className="text-[#085a70]" />, label: "GPS Guardian" },
                { icon: <Users size={12} className="text-[#0d9488]" />, label: "Local Dispatch" },
                { icon: <ShieldAlert size={12} className="text-rose-600" />, label: "Distress SOS" },
              ].map((f, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/35 border border-[#085a70]/10 backdrop-blur-sm shadow-sm transition-transform hover:scale-[1.02]">
                  {f.icon}
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#083344]">{f.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA Actions */}
      <div className="relative z-10 px-6 pb-12 w-full max-w-md mx-auto flex flex-col gap-3">
        <AnimatePresence>
          {phase >= 3 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/create-account" className="block w-full">
                  <Button
                    size="lg"
                    className="w-full rounded-full h-14 text-xs uppercase tracking-widest font-black text-white shadow-lg hover:brightness-105 active:scale-[0.98] transition-all duration-200"
                    style={{ 
                      background: "linear-gradient(135deg, #0d9488, #085a70)",
                      boxShadow: "0 10px 20px -8px rgba(8,90,112,0.4)"
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      Get Started <ArrowRight size={13} className="stroke-[3]" />
                    </div>
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/home" className="block w-full">
                  <Button
                    size="lg"
                    className="w-full rounded-full h-14 text-xs font-black uppercase tracking-wider border border-[#085a70]/20 text-[#083344] bg-white/40 backdrop-blur-sm hover:bg-white/60 active:scale-[0.98] transition-all"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-[9px] font-extrabold uppercase tracking-widest text-[#085a70]/70 mt-1 flex items-center justify-center gap-1"
              >
                <Star size={9} className="text-amber-500 fill-current" />
                <span>Safeguarding over 12,000 active members</span>
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
