import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Shield, ArrowRight, Star, MapPin, Users } from "lucide-react";

export function Landing() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden"
         style={{ background: "linear-gradient(180deg, #fef2f3 0%, #ffffff 40%, #f0fdf4 100%)" }}>

      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-2xl" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-24 left-8 w-16 h-16 rounded-2xl bg-white shadow-lg shadow-rose-200/50 flex items-center justify-center"
        animate={{ y: [-6, 6, -6], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield size={24} className="text-rose-400" />
      </motion.div>
      <motion.div
        className="absolute top-32 right-10 w-14 h-14 rounded-2xl bg-white shadow-lg shadow-emerald-200/50 flex items-center justify-center"
        animate={{ y: [4, -4, 4], rotate: [2, -2, 2] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <MapPin size={22} className="text-emerald-400" />
      </motion.div>
      <motion.div
        className="absolute bottom-48 left-6 w-12 h-12 rounded-2xl bg-white shadow-lg shadow-violet-200/50 flex items-center justify-center"
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Users size={20} className="text-violet-400" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 pt-24 pb-8">
        
        {/* Brand logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-2xl shadow-rose-200">
            <span className="text-5xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>A</span>
          </div>
        </motion.div>

        {/* Greeting */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}>
                Hello, I'm Astra.
              </h1>
              
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="text-lg text-rose-500 font-semibold tracking-wide">
                      You are never alone.
                    </p>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-rose-300 to-pink-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tag line */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 text-sm text-slate-500 text-center max-w-xs leading-relaxed"
            >
              Your personal safety companion — calm by default, emergency-ready always.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Feature badges */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2 justify-center mt-8"
            >
              {[
                { icon: "🛡️", label: "Real-time safety" },
                { icon: "📍", label: "Live tracking" },
                { icon: "👥", label: "Guardian network" },
                { icon: "🚨", label: "Instant SOS" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm">
                  <span className="text-sm">{f.icon}</span>
                  <span className="text-xs font-medium text-slate-600">{f.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 px-8 pb-12 flex flex-col gap-3">
        <AnimatePresence>
          {phase >= 3 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/create-account" className="block w-full">
                  <Button
                    size="lg"
                    className="w-full rounded-2xl h-16 text-base font-bold text-white shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all"
                    style={{ background: "linear-gradient(135deg, #f43e5c, #e11d48)" }}
                  >
                    <div className="flex items-center gap-2">
                      Get Started <ArrowRight size={18} />
                    </div>
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/home" className="block w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-2xl h-14 text-base font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 bg-white"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-xs text-slate-400 mt-2"
              >
                <Star size={12} className="inline text-amber-400 mr-1" fill="currentColor" />
                Trusted by 12,000+ women across 40 cities
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}