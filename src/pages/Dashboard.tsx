import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, TrendingUp, Trophy, Clock, MapPin, Play } from "lucide-react";
import { useState } from "react";

const TABS = ["Score", "Stats", "Leaderboard", "Timeline"];

const LEADERBOARD = [
  { rank: 1, name: "Meera S.", score: 980, helps: 34, badge: "🛡️" },
  { rank: 2, name: "Ananya F.", score: 920, helps: 28, badge: "✓" },
  { rank: 3, name: "Priya S.", score: 870, helps: 22, badge: "🏠", isYou: true },
  { rank: 4, name: "Divya K.", score: 800, helps: 18, badge: "🏠" },
  { rank: 5, name: "Lakshmi R.", score: 760, helps: 14, badge: "✓" },
];

const TIMELINE = [
  { time: "Today 8:12 PM", event: "Walk completed — Home → College", icon: "✓", color: "#0d9488" },
  { time: "Yesterday 7:45 PM", event: "Guardian response — helped Riya N.", icon: "🛡️", color: "#3b82f6" },
  { time: "Mon 6:30 PM", event: "SOS triggered — resolved in 4 min", icon: "🚨", color: "#f43e5c" },
  { time: "Sun 9:00 AM", event: "Safe zone added — Office", icon: "📍", color: "#8b5cf6" },
  { time: "Fri 8:15 PM", event: "Walk completed — Market → Home", icon: "✓", color: "#0d9488" },
];

const WEEKLY_STATS = [
  { label: "Walks", value: "7", sub: "this week" },
  { label: "Guardians", value: "3", sub: "avg nearby" },
  { label: "Alerts", value: "2", sub: "rerouted" },
  { label: "Safe rate", value: "100%", sub: "all walks" },
];

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const fill = (score / 1000) * circ;
  return (
    <div className="flex flex-col items-center my-6">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12"/>
          <motion.circle
            cx="80" cy="80" r={r} fill="none"
            stroke="url(#scoreGrad)" strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - fill }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43e5c"/>
              <stop offset="100%" stopColor="#0d9488"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-5xl font-black text-[#083344]"
          >
            {score}
          </motion.div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#085a70]/70 mt-1">Safety Score</div>
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        {[
          { label: "Community", color: "#f43e5c" },
          { label: "Responses", color: "#3b82f6" },
          { label: "Reliability", color: "#0d9488" },
        ].map(b => (
          <div key={b.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }}/>
            <span className="text-xs font-bold text-[#083344]/70">{b.label}</span>
          </div>
        ))}
      </div>
      <p className="text-xs font-medium text-[#085a70]/80 mt-4 text-center max-w-xs px-6 leading-relaxed">
        Top 15% in your area. Keep walking safely to grow your score.
      </p>
    </div>
  );
}

export function Dashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Score");

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-slate-50 text-[#083344] font-sans">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-4 pt-12 border-b border-[#085a70]/10 bg-white/80 backdrop-blur">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-slate-100 transition-colors" data-testid="btn-back">
          <ArrowLeft size={20} className="text-[#083344]"/>
        </button>
        <h1 className="text-lg font-black uppercase tracking-wider text-[#083344]">Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="relative z-10 flex border-b border-[#085a70]/10 px-2 bg-white/50 backdrop-blur-xs">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-testid={`tab-${tab.toLowerCase()}`}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab ? "text-[#0d9488] border-[#0d9488]" : "text-[#085a70]/60 border-transparent hover:text-[#083344]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto pb-24">
        {activeTab === "Score" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ScoreRing score={870} />
            <div className="grid grid-cols-2 gap-3 px-4 mb-4">
              {WEEKLY_STATS.map(s => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-sm"
                >
                  <div className="text-2xl font-black text-[#083344]">{s.value}</div>
                  <div className="text-xs font-bold text-[#085a70]/80 mt-0.5 uppercase tracking-wider">{s.label}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Stats" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 flex flex-col gap-4">
            <div className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-rose-500"/>
                <span className="text-[#083344] font-black uppercase tracking-wider text-xs">Weekly Activity</span>
              </div>
              <div className="flex items-end gap-2 h-24">
                {[3, 5, 2, 7, 4, 6, 3].map((v, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{ background: i === 6 ? "#f43e5c" : "#0d9488" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / 7) * 100}%` }}
                    transition={{ delay: i * 0.08 }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["M","T","W","T","F","S","S"].map((d,i) => (
                  <span key={i} className="flex-1 text-center text-xs font-black text-slate-400">{d}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-[#0d9488]"/>
                <span className="text-[#083344] font-black uppercase tracking-wider text-xs">Guardian Stats</span>
              </div>
              {[
                { label: "Times I helped someone", value: "12" },
                { label: "Avg response time", value: "3.2 min" },
                { label: "Guardian rating", value: "4.8 ★" },
                { label: "Total distance covered", value: "24 km" },
              ].map(s => (
                <div key={s.label} className="flex justify-between py-2.5 border-b border-[#085a70]/5 last:border-0">
                  <span className="text-xs font-extrabold text-[#085a70]/80 uppercase tracking-wider">{s.label}</span>
                  <span className="text-xs font-black text-[#083344]">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Leaderboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            <p className="text-xs font-bold text-[#085a70]/70 uppercase tracking-wider mb-4">Top guardians in your area this month</p>
            {LEADERBOARD.map((u, i) => (
              <motion.div
                key={u.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-3 p-4 rounded-2xl mb-2 border ${u.isYou ? "border-rose-500 bg-rose-50/50" : "border-[#085a70]/10 bg-white shadow-xs"}`}
              >
                <div className="w-8 text-center font-black text-xs" style={{ color: u.rank <= 3 ? ["#b59410","#718096","#a0522d"][u.rank-1] : "#64748b" }}>
                  #{u.rank}
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-slate-100 border border-slate-200">{u.badge}</div>
                <div className="flex-1">
                  <div className="font-bold text-[#083344] text-xs uppercase tracking-wider">{u.name}{u.isYou && <span className="text-rose-500 font-black ml-2">(You)</span>}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.helps} helps</div>
                </div>
                <div className="font-black text-xs text-[#083344]">{u.score}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "Timeline" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            {TIMELINE.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3 mb-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                       style={{ background: e.color + "15", border: `1px solid ${e.color}33` }}>
                    {e.icon}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-px flex-1 mt-1 bg-slate-200"/>}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-xs font-bold text-[#083344] uppercase tracking-wider">{e.event}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{e.time}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
