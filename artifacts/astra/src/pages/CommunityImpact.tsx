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
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Community Impact</h1>
          <p className="text-xs text-slate-400">Real numbers, real lives changed</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-5">
        {/* Hero stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-6 text-center border border-primary/20"
          style={{ background: "linear-gradient(135deg, #1a0d1a, #0f1a2a)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-1"
          >
            203
          </motion.div>
          <div className="text-slate-300 font-medium">women kept safe this week</div>
          <div className="text-slate-500 text-sm mt-1">across 40 cities</div>
          <div className="mt-4 h-1 rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #e85d7a, #60a5fa)" }}
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-2">78% of weekly goal</div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 border border-white/10"
              style={{ background: "#111827" }}
            >
              <s.icon size={18} style={{ color: s.color }} className="mb-2"/>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              <div className="text-xs font-medium mt-1" style={{ color: s.color }}>{s.change} this month</div>
            </motion.div>
          ))}
        </div>

        {/* Cities */}
        <div className="rounded-2xl p-4 border border-white/10" style={{ background: "#111827" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-secondary"/>
            <span className="text-white font-semibold text-sm">Top Cities</span>
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
                <span className="text-sm text-white">{c.city}</span>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span>{c.guardians} guardians</span>
                  <span className="text-green-400">{c.safe} safe</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
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
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Stories from the community</h3>
          <div className="flex flex-col gap-3">
            {IMPACT_STORIES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-4 border border-white/10"
                style={{ background: "#111827" }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{s.name}</div>
                    <div className="text-sm text-slate-300 leading-relaxed">{s.story}</div>
                    <div className="text-xs text-slate-500 mt-2">{s.time}</div>
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
