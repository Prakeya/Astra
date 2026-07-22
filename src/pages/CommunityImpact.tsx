import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Users, Shield, MapPin, TrendingUp, Heart } from "lucide-react";

const STATS = [
  { label: "Guardians Active", value: "2,847", change: "+12%", icon: Users, color: "#60a5fa" },
  { label: "Women Protected", value: "14,203", change: "+8%", icon: Shield, color: "#22c55e" },
  { label: "SOS Resolved", value: "1,089", change: "+5%", icon: Heart, color: "#e85d7a" },
  { label: "Cities Covered", value: "40", change: "+3", icon: MapPin, color: "#a78bfa" },
];

const IMPACT_STORIES = [
  { name: "Riya N.", story: "3 guardians arrived in under 5 minutes when I felt unsafe near the bus stop.", time: "2 days ago", emoji: "🙏" },
  { name: "Sneha P.", story: "The rerouting feature saved me from a poorly lit alley I hadn't noticed.", time: "4 days ago", emoji: "💪" },
  { name: "Kavitha R.", story: "Became a guardian 2 months ago. Helped 8 women so far. Best decision.", time: "1 week ago", emoji: "🛡️" },
];

const CITY_DATA = [
  { city: "Bangalore", guardians: 840, safe: "98%", bar: 0.9 },
  { city: "Mumbai", guardians: 720, safe: "97%", bar: 0.8 },
  { city: "Delhi", guardians: 650, safe: "95%", bar: 0.72 },
  { city: "Chennai", guardians: 410, safe: "98%", bar: 0.6 },
  { city: "Hyderabad", guardians: 380, safe: "96%", bar: 0.55 },
];

export function CommunityImpact() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-[#083344] font-sans">
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-[#085a70]/10 bg-white/80 backdrop-blur">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-slate-100 transition-colors" data-testid="btn-back">
          <ArrowLeft size={20} className="text-[#083344]"/>
        </button>
        <div>
          <h1 className="text-lg font-black uppercase tracking-wider text-[#083344]">Community Impact</h1>
          <p className="text-xs font-medium text-[#085a70]/70">Real numbers, real lives changed</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-5">
        {/* Hero stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-6 text-center border border-[#085a70]/10 bg-white shadow-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-black text-[#0d9488] mb-1"
          >
            203
          </motion.div>
          <div className="text-[#083344] font-bold uppercase tracking-wider text-xs">women kept safe this week</div>
          <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">across 40 cities</div>
          <div className="mt-4 h-1.5 rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #f43e5c, #0d9488)" }}
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">78% of weekly goal</div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-sm"
            >
              <s.icon size={18} style={{ color: s.color }} className="mb-2"/>
              <div className="text-xl font-black text-[#083344]">{s.value}</div>
              <div className="text-xs font-bold text-[#085a70]/70 mt-0.5 uppercase tracking-wider">{s.label}</div>
              <div className="text-[10px] font-black mt-1 uppercase tracking-widest" style={{ color: s.color }}>{s.change} this month</div>
            </motion.div>
          ))}
        </div>

        {/* Cities */}
        <div className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#0d9488]"/>
            <span className="text-[#083344] font-black text-xs uppercase tracking-wider">Top Cities</span>
          </div>
          {CITY_DATA.map((c, i) => (
            <motion.div
              key={c.city}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="mb-3 last:mb-0"
            >
              <div className="flex justify-between mb-1">
                <span className="text-xs font-black text-[#083344] uppercase tracking-wider">{c.city}</span>
                <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <span>{c.guardians} guardians</span>
                  <span className="text-emerald-600">{c.safe} safe</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#f43e5c] to-[#0d9488]"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.bar * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stories */}
        <div>
          <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-3">Stories from the community</h3>
          <div className="flex flex-col gap-3">
            {IMPACT_STORIES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <div className="text-xs font-black text-[#083344] mb-1 uppercase tracking-wider">{s.name}</div>
                    <div className="text-xs text-[#085a70]/80 leading-relaxed font-medium">{s.story}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-2">{s.time}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
