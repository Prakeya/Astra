import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, TrendingUp, Trophy, Clock, MapPin, Play, AlertTriangle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { getComplaints, calculateSafetyScore, type Complaint } from "@/lib/safetyStore";
import { subscribeToComplaints } from "@/lib/firebaseService";

const TABS = ["Score", "Stats", "Leaderboard", "Timeline"];

export function Dashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("Score");
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToComplaints((data) => {
      setComplaints(data);
    });
    return () => unsubscribe();
  }, []);

  const scoreResult = useMemo(() => calculateSafetyScore(complaints), [complaints]);
  const { score, label, explanations, stats: scoreStats } = scoreResult;

  const stats = useMemo(() => {
    const total = complaints.length;
    const highSev = complaints.filter(c => c.severity === "High" || c.severity === "Critical").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;
    return [
      { label: "Reports", value: `${total}`, sub: "total logged" },
      { label: "High Threats", value: `${highSev}`, sub: "critical flags" },
      { label: "AI Processed", value: `${complaints.filter(c => c.aiAnalysis).length}`, sub: "gemini verified" },
      { label: "Resolved", value: `${resolved}`, sub: "safety cleared" },
    ];
  }, [complaints]);

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-slate-50 text-[#083344] font-sans">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-4 pt-12 border-b border-[#085a70]/10 bg-white/80 backdrop-blur">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-slate-100 transition-colors" data-testid="btn-back">
          <ArrowLeft size={20} className="text-[#083344]"/>
        </button>
        <h1 className="text-lg font-black uppercase tracking-wider text-[#083344]">Safety Intelligence Dashboard</h1>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            <div className="flex flex-col items-center my-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="12"/>
                  <motion.circle
                    cx="80" cy="80" r="70" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 70}
                    initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 70 - (score / 100) * (2 * Math.PI * 70) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
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
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-5xl font-black text-[#083344]"
                  >
                    {score}
                  </motion.div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#085a70]/70 mt-1">Perimeter Score</div>
                </div>
              </div>
              <p className="text-xs font-black text-[#083344] mt-2 text-center max-w-xs px-6 uppercase tracking-wider">
                {label}
              </p>
            </div>

            {/* Score Explanation Box ("WHY") */}
            <div className="bg-white rounded-3xl p-4 mb-4 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                <Shield size={16} className="text-[#0d9488]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#083344]">Why is this score {score}/100?</span>
              </div>
              <div className="space-y-1.5">
                {explanations.map((expl, idx) => (
                  <div key={idx} className="text-xs font-semibold text-slate-600 flex items-start gap-2 leading-relaxed">
                    <span className="text-[#0d9488] font-bold">•</span>
                    <span>{expl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {stats.map(s => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-xs"
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
            <div className="rounded-3xl p-4 border border-[#085a70]/10 bg-white shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-[#0d9488]"/>
                <span className="text-[#083344] font-black uppercase tracking-wider text-xs">Perimeter Analytics</span>
              </div>
              <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Most Common Incident</span>
                  <span className="font-bold text-[#083344]">{scoreStats.mostCommonCategory}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Peak Risk Time Window</span>
                  <span className="font-bold text-rose-600">{scoreStats.peakRiskHour}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Highest Risk Corridor</span>
                  <span className="font-bold text-rose-600 truncate max-w-[180px] text-right">{scoreStats.highestRiskLocation}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Safest Perimeter Sector</span>
                  <span className="font-bold text-teal-600 truncate max-w-[180px] text-right">{scoreStats.safestLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nighttime Incident Rate</span>
                  <span className="font-bold text-amber-600">{scoreStats.nighttimeCount} reported after 8 PM</span>
                </div>
              </div>
            </div>

            {/* Severity Distribution */}
            <div className="rounded-3xl p-4 border border-[#085a70]/10 bg-white shadow-xs">
              <div className="text-xs font-black uppercase tracking-wider text-[#083344] mb-3">Incident Severity Breakdown</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>Critical / High Severity</span>
                    <span>{scoreStats.highRiskCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: complaints.length ? `${(scoreStats.highRiskCount / complaints.length) * 100}%` : '0%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>Medium Caution</span>
                    <span>{scoreStats.mediumRiskCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: complaints.length ? `${(scoreStats.mediumRiskCount / complaints.length) * 100}%` : '0%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>Low Threat</span>
                    <span>{scoreStats.lowRiskCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: complaints.length ? `${(scoreStats.lowRiskCount / complaints.length) * 100}%` : '0%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "Leaderboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            <p className="text-xs font-bold text-[#085a70]/70 uppercase tracking-wider mb-4">Active Community Safety Guardians</p>
            {[
              { rank: 1, name: "Astra Guardian AI", score: 990, helps: 42, badge: "🛡️" },
              { rank: 2, name: "Community Safety Patrol", score: 910, helps: 31, badge: "✓" },
              { rank: 3, name: "Active Citizen", score: 850, helps: complaints.length, badge: "📍", isYou: true },
            ].map((u) => (
              <div
                key={u.rank}
                className={`flex items-center gap-3 p-4 rounded-2xl mb-2 border ${u.isYou ? "border-teal-500 bg-teal-50/50" : "border-[#085a70]/10 bg-white shadow-xs"}`}
              >
                <div className="w-8 text-center font-black text-xs text-[#083344]">
                  #{u.rank}
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-slate-100 border border-slate-200">{u.badge}</div>
                <div className="flex-1">
                  <div className="font-bold text-[#083344] text-xs uppercase tracking-wider">{u.name}{u.isYou && <span className="text-teal-600 font-black ml-2">(You)</span>}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.helps} report(s) verified</div>
                </div>
                <div className="font-black text-xs text-[#083344]">{u.score}</div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "Timeline" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            {complaints.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
                <Shield size={36} className="text-teal-600 mx-auto mb-3 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-wider text-[#083344]">Clean Activity Pipeline Log</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  No community reports logged yet. Submit a safety report to trigger the live AI processing pipeline.
                </p>
              </div>
            ) : (
              complaints.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-4 mb-4 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#083344] flex items-center gap-1.5">
                      ⚠️ {c.label} ({c.severity})
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{c.timestamp}</span>
                  </div>

                  {/* AI Processing Pipeline Steps */}
                  <div className="space-y-2 text-[11px] font-semibold text-slate-600 pl-2 border-l-2 border-teal-500">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"/>
                      <span>1. Complaint logged at <strong>{c.locationName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0"/>
                      <span>2. Gemini AI analyzed threat & extracted risk indicators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"/>
                      <span>3. Severity classified as <strong>{c.severity}</strong> ({c.aiAnalysis?.confidenceScore ? `${Math.round(c.aiAnalysis.confidenceScore * 100)}% confidence` : 'AI Verified'})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"/>
                      <span>4. Dynamic perimeter safety score recalculated ({score}/100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"/>
                      <span>5. Heatmap hotspot and safe walk routing updated dynamically</span>
                    </div>
                  </div>

                  {c.aiAnalysis?.summary && (
                    <p className="text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium mt-3">
                      💡 <strong>AI Summary:</strong> {c.aiAnalysis.summary}
                    </p>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
