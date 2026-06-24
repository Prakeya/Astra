import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { guardians } from "@/lib/mockData";
import { useState } from "react";

export function SafeNow() {
  const [rated, setRated] = useState(false);
  const [shared, setShared] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden text-center"
         style={{ background: "#0d1629" }}>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)" }}/>

      <motion.div initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:"spring", stiffness:200, damping:20 }}
        className="w-full max-w-sm relative z-10">

        {/* Sparkle icon */}
        <motion.div
          initial={{ scale:0 }} animate={{ scale:1 }}
          transition={{ type:"spring", stiffness:260, damping:18, delay:0.15 }}
          className="w-20 h-20 rounded-full mx-auto mb-7 flex items-center justify-center"
          style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}>
          <motion.span className="text-4xl"
            animate={{ scale:[1, 1.1, 1], rotate:[0,5,-5,0] }}
            transition={{ delay:0.8, duration:0.5 }}>✦</motion.span>
        </motion.div>

        <motion.h1 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="text-4xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily:"'Outfit', sans-serif" }}>
          You are safe.
        </motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          className="text-lg mb-8" style={{ color:"#8892a4" }}>
          Thank you.
        </motion.p>

        {/* Guardian cards */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
          className="rounded-2xl mb-8 overflow-hidden border border-white/10"
          style={{ background: "rgba(255,255,255,0.04)" }}>
          {guardians.map((g, i) => (
            <motion.div key={g.id}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 + i * 0.12 }}
              className={`flex items-center gap-3 px-5 py-4 ${i < guardians.length - 1 ? "border-b border-white/8" : ""}`}>
              <span className="text-xl">🙏</span>
              <span className="text-white font-medium text-sm flex-1 text-left">{g.name}</span>
              <span className="text-sm" style={{ color:"#6b7a96" }}>
                {g.status === "arriving" ? `arrived in ${g.eta}` : g.status === "police" ? "called police" : "stayed on line"}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }}
          className="flex flex-col gap-3">
          <button onClick={() => setShared(true)}
            className={`w-full h-14 rounded-full font-medium text-sm border transition-all ${shared ? "border-green-500/40 text-green-300 bg-green-500/10" : "border-white/15 text-white bg-white/5 hover:bg-white/10"}`}
            data-testid="btn-share-story">
            {shared ? "✓ Story shared" : "Share Story"}
          </button>
          <button onClick={() => setRated(true)}
            className={`w-full h-14 rounded-full font-medium text-sm border transition-all ${rated ? "border-amber-500/40 text-amber-300 bg-amber-500/10" : "border-white/15 text-white bg-white/5 hover:bg-white/10"}`}
            data-testid="btn-rate">
            {rated ? "✓ Guardians rated — thank you!" : "Rate Guardians"}
          </button>
          <Link href="/home" className="w-full">
            <Button className="w-full h-14 rounded-full font-semibold text-white text-base"
              style={{ background: "linear-gradient(135deg, #e85d7a, #c23a5a)" }}
              data-testid="btn-done">
              Done
            </Button>
          </Link>
        </motion.div>

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
          className="text-xs mt-10 px-4 leading-relaxed" style={{ color:"#3d4a5c" }}>
          This week: 47 guardians kept 203 women safe. You're one of them.
        </motion.p>
      </motion.div>
    </div>
  );
}
