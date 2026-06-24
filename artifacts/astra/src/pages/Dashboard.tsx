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
  { time: "Today 8:12 PM", event: "Walk completed — Home → College", icon: "✓", color: "#22c55e" },
  { time: "Yesterday 7:45 PM", event: "Guardian response — helped Riya N.", icon: "🛡️", color: "#60a5fa" },
  { time: "Mon 6:30 PM", event: "SOS triggered — resolved in 4 min", icon: "🚨", color: "#e85d7a" },
  { time: "Sun 9:00 AM", event: "Safe zone added — Office", icon: "📍", color: "#a78bfa" },
  { time: "Fri 8:15 PM", event: "Walk completed — Market → Home", icon: "✓", color: "#22c55e" },
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
          <circle cx="80" cy="80" r={r} fill="none" stroke="#1e293b" strokeWidth="12"/>
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
              <stop offset="0%" stopColor="#e85d7a"/>
              <stop offset="100%" stopColor="#60a5fa"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-5xl font-bold text-white"
          >
            {score}
          </motion.div>
          <div className="text-xs text-slate-400 mt-1">Safety Score</div>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        {[
          { label: "Community", color: "#e85d7a" },
          { label: "Responses", color: "#60a5fa" },
          { label: "Reliability", color: "#22c55e" },
        ].map(b => (
          <div key={b.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: b.color }}/>
            <span className="text-xs text-slate-400">{b.label}</span>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-400 mt-4 text-center max-w-xs px-4">
        Top 15% in your area. Keep walking safely to grow your score.
      </p>
    </div>
  );
}

export function Dashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Score");

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <h1 className="text-lg font-bold text-white">Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-2">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-testid={`tab-${tab.toLowerCase()}`}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary" : "text-slate-400"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "Score" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ScoreRing score={870} />
            <div className="grid grid-cols-2 gap-3 px-4 mb-4">
              {WEEKLY_STATS.map(s => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 border border-white/10"
                  style={{ background: "#111827" }}
                >
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-slate-300 mt-0.5">{s.label}</div>
                  <div className="text-xs text-slate-500">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Stats" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 flex flex-col gap-4">
            <div className="rounded-2xl p-4 border border-white/10" style={{ background: "#111827" }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-primary"/>
                <span className="text-white font-semibold">Weekly Activity</span>
              </div>
              <div className="flex items-end gap-2 h-24">
                {[3, 5, 2, 7, 4, 6, 3].map((v, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{ background: i === 6 ? "#e85d7a" : "#1e3a5f" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / 7) * 100}%` }}
                    transition={{ delay: i * 0.08 }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["M","T","W","T","F","S","S"].map((d,i) => (
                  <span key={i} className="flex-1 text-center text-xs text-slate-500">{d}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-4 border border-white/10" style={{ background: "#111827" }}>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-secondary"/>
                <span className="text-white font-semibold">Guardian Stats</span>
              </div>
              {[
                { label: "Times I helped someone", value: "12" },
                { label: "Avg response time", value: "3.2 min" },
                { label: "Guardian rating", value: "4.8 ★" },
                { label: "Total distance covered", value: "24 km" },
              ].map(s => (
                <div key={s.label} className="flex justify-between py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-400">{s.label}</span>
                  <span className="text-sm font-semibold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Leaderboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            <p className="text-sm text-slate-400 mb-4">Top guardians in your area this month</p>
            {LEADERBOARD.map((u, i) => (
              <motion.div
                key={u.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-3 p-4 rounded-2xl mb-2 border ${u.isYou ? "border-primary/40" : "border-white/10"}`}
                style={{ background: u.isYou ? "#1a0f1a" : "#111827" }}
              >
                <div className="w-8 text-center font-bold" style={{ color: u.rank <= 3 ? ["#ffd700","#c0c0c0","#cd7f32"][u.rank-1] : "#64748b" }}>
                  #{u.rank}
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                     style={{ background: "#1e293b" }}>{u.badge}</div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{u.name}{u.isYou && <span className="text-primary text-xs ml-2">(You)</span>}</div>
                  <div className="text-xs text-slate-400">{u.helps} helps</div>
                </div>
                <div className="font-bold text-white">{u.score}</div>
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
                       style={{ background: e.color + "22", border: `1px solid ${e.color}44` }}>
                    {e.icon}
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-px flex-1 mt-1 bg-white/10"/>}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm text-white font-medium">{e.event}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{e.time}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
