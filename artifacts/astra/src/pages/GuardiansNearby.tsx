import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Star, MapPin, Shield, Clock } from "lucide-react";
import { useState } from "react";

const GUARDIANS = [
  { id: 1, name: "Ananya F.", distance: "80m", eta: "2 min", badge: "✓", level: "Verified", rating: 4.9, helps: 28, status: "active", available: "6PM-11PM" },
  { id: 2, name: "Meera S.", distance: "120m", eta: "3 min", badge: "🛡️", level: "Police-Verified", rating: 5.0, helps: 34, status: "active", available: "Always" },
  { id: 3, name: "Kavitha R.", distance: "200m", eta: "5 min", badge: "🏠", level: "Community", rating: 4.7, helps: 12, status: "active", available: "7PM-10PM" },
  { id: 4, name: "Sunita M.", distance: "350m", eta: "8 min", badge: "✓", level: "Verified", rating: 4.8, helps: 19, status: "busy", available: "8PM-12AM" },
  { id: 5, name: "Divya K.", distance: "400m", eta: "10 min", badge: "🏠", level: "Community", rating: 4.6, helps: 9, status: "active", available: "6PM-9PM" },
];

const BADGE_COLOR: Record<string, string> = {
  "Community": "#60a5fa",
  "Verified": "#22c55e",
  "Police-Verified": "#a78bfa",
};

export function GuardiansNearby() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? GUARDIANS : GUARDIANS.filter(g => g.level === filter);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Guardians Nearby</h1>
          <p className="text-xs text-slate-400">{GUARDIANS.filter(g=>g.status==="active").length} active now</p>
        </div>
      </div>

      {/* Map preview */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden border border-white/10"
           style={{ height: 160, background: "linear-gradient(135deg, #0f172a, #0a1628)" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 160">
          {/* Grid lines */}
          {[40,80,120,160,200,240,280,320].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#1e3a5f" strokeWidth="0.5"/>
          ))}
          {[40,80,120].map(y => (
            <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="#1e3a5f" strokeWidth="0.5"/>
          ))}
          {/* Roads */}
          <path d="M0,80 L380,80" stroke="#1e3a5f" strokeWidth="3"/>
          <path d="M190,0 L190,160" stroke="#1e3a5f" strokeWidth="3"/>
          {/* You */}
          <motion.circle cx="190" cy="80" r="8" fill="#e85d7a"
            animate={{ r: [8,14,8], opacity: [1,0.3,1] }}
            transition={{ duration: 1.8, repeat: Infinity }}/>
          <circle cx="190" cy="80" r="5" fill="#e85d7a"/>
          {/* Guardian dots */}
          {[{cx:145,cy:62},{cx:220,cy:95},{cx:170,cy:108},{cx:255,cy:72},{cx:130,cy:100}].map((g,i) => (
            <g key={i}>
              <motion.circle cx={g.cx} cy={g.cy} r="6" fill="#60a5fa"
                animate={{ r: [6,10,6], opacity: [0.6,0.2,0.6] }}
                transition={{ duration: 2, delay: i*0.3, repeat: Infinity }}/>
              <circle cx={g.cx} cy={g.cy} r="4" fill="#60a5fa"/>
            </g>
          ))}
        </svg>
        <div className="absolute bottom-2 right-2 bg-black/50 rounded-lg px-2 py-1">
          <span className="text-xs text-slate-300">5 guardians in range</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto pb-1">
        {["All", "Community", "Verified", "Police-Verified"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            data-testid={`filter-${f.toLowerCase()}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-primary text-white" : "bg-white/10 text-slate-300"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 mt-4 pb-24 flex flex-col gap-3">
        {filtered.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-4 border border-white/10"
            style={{ background: "#111827" }}
            data-testid={`guardian-card-${g.id}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                   style={{ background: "#1e293b" }}>
                {g.badge}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{g.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium`}
                        style={{ background: BADGE_COLOR[g.level]+"22", color: BADGE_COLOR[g.level] }}>
                    {g.level}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin size={11}/> {g.distance}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11}/> {g.eta}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <Star size={11} fill="currentColor"/> {g.rating}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500">{g.helps} helps</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-500">{g.available}</span>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${g.status === "active" ? "bg-green-400" : "bg-slate-500"}`}/>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
