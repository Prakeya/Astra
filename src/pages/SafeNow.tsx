import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { guardians } from "@/lib/mockData";
import { useState } from "react";

export function SafeNow() {
  const [rated, setRated] = useState(false);
  const [shared, setShared] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-6 relative overflow-hidden text-center bg-[#e0f2fe] text-[#083344]">

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)" }}/>

      <motion.div initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:"spring", stiffness:200, damping:20 }}
        className="w-full max-w-sm relative z-10">

        {/* Sparkle icon */}
        <motion.div
          initial={{ scale:0 }} animate={{ scale:1 }}
          transition={{ type:"spring", stiffness:260, damping:18, delay:0.15 }}
          className="w-20 h-20 rounded-full mx-auto mb-7 flex items-center justify-center bg-white border border-[#085a70]/10 shadow-md">
          <motion.span className="text-4xl text-[#0d9488]"
            animate={{ scale:[1, 1.1, 1], rotate:[0,5,-5,0] }}
            transition={{ delay:0.8, duration:0.5 }}>✦</motion.span>
        </motion.div>

        <motion.h1 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="text-3xl font-black uppercase tracking-wider text-[#083344] mb-1 font-sans">
          You are safe.
        </motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          className="text-xs font-black uppercase tracking-widest text-[#085a70]/80 mb-8">
          Thank you.
        </motion.p>

        {/* Guardian cards */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
          className="rounded-[2rem] mb-8 overflow-hidden border border-[#085a70]/10 bg-white/55 backdrop-blur-md shadow-sm">
          {guardians.map((g, i) => (
            <motion.div key={g.id}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 + i * 0.12 }}
              className={`flex items-center gap-3 px-5 py-4 ${i < guardians.length - 1 ? "border-b border-[#085a70]/5" : ""}`}>
              <span className="text-xl">🙏</span>
              <span className="text-[#083344] font-black text-xs uppercase tracking-wider flex-1 text-left">{g.name}</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0d9488] bg-[#0d9488]/10 px-2.5 py-0.5 rounded-full border border-[#0d9488]/15">
                {g.status === "arriving" ? `arrived in ${g.eta}` : g.status === "police" ? "called police" : "stayed on line"}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }}
          className="flex flex-col gap-3">
          <button onClick={() => setShared(true)}
            className={`w-full h-14 rounded-full font-black text-[10px] uppercase tracking-widest border transition-all ${shared ? "border-teal-500/30 text-[#0d9488] bg-[#0d9488]/10" : "border-[#085a70]/15 text-[#083344] bg-white/60 hover:bg-white"}`}
            data-testid="btn-share-story">
            {shared ? "✓ Story shared" : "Share Story"}
          </button>
          <button onClick={() => setRated(true)}
            className={`w-full h-14 rounded-full font-black text-[10px] uppercase tracking-widest border transition-all ${rated ? "border-teal-500/30 text-[#0d9488] bg-[#0d9488]/10" : "border-[#085a70]/15 text-[#083344] bg-white/60 hover:bg-white"}`}
            data-testid="btn-rate">
            {rated ? "✓ Guardians rated — thank you!" : "Rate Guardians"}
          </button>
          <Link href="/home" className="w-full">
            <Button className="w-full h-14 rounded-full font-black text-white text-xs uppercase tracking-widest border border-teal-500/10 shadow-lg"
              style={{ background: "linear-gradient(135deg, #0d9488, #085a70)" }}
              data-testid="btn-done">
              Done
            </Button>
          </Link>
        </motion.div>

        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
          className="text-[10px] font-black uppercase tracking-wider mt-10 px-4 leading-relaxed text-[#085a70]/70">
          This week: 47 guardians kept 203 women safe. You're one of them.
        </motion.p>
      </motion.div>
    </div>
  );
}
