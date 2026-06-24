import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, Lightbulb, Eye, Construction } from "lucide-react";
import { useState } from "react";

const INCIDENTS = [
  { id: 1, type: "harassment", label: "Harassment", x: 140, y: 90, color: "#e85d7a", time: "2h ago", count: 3 },
  { id: 2, type: "lighting", label: "Poor Lighting", x: 240, y: 130, color: "#fbbf24", time: "5h ago", count: 7 },
  { id: 3, type: "suspicious", label: "Suspicious", x: 80, y: 150, color: "#f97316", time: "1d ago", count: 2 },
  { id: 4, type: "unsafe_path", label: "Unsafe Path", x: 300, y: 80, color: "#a78bfa", time: "6h ago", count: 4 },
  { id: 5, type: "lighting", label: "Poor Lighting", x: 190, y: 170, color: "#fbbf24", time: "3h ago", count: 5 },
  { id: 6, type: "harassment", label: "Harassment", x: 330, y: 150, color: "#e85d7a", time: "30m ago", count: 1 },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "harassment", label: "Harassment" },
  { key: "lighting", label: "Lighting" },
  { key: "suspicious", label: "Suspicious" },
  { key: "unsafe_path", label: "Unsafe Path" },
];

export function IncidentMap() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<number | null>(null);

  const visible = filter === "all" ? INCIDENTS : INCIDENTS.filter(i => i.type === filter);
  const selInc = INCIDENTS.find(i => i.id === selected);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Incident Map</h1>
          <p className="text-xs text-slate-400">Community-reported safety data</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            data-testid={`filter-${f.key}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.key ? "bg-primary text-white" : "bg-white/10 text-slate-300"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="relative mx-4 rounded-2xl overflow-hidden border border-white/10" style={{ height: 260, background: "linear-gradient(135deg, #0f172a, #0a1628)" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 260">
          {[40,80,120,160,200,240,280,320,360].map(x=>(
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="260" stroke="#1e3a5f" strokeWidth="0.5"/>
          ))}
          {[40,80,120,160,200].map(y=>(
            <line key={`h${y}`} x1="0" y1={y} x2="380" y2={y} stroke="#1e3a5f" strokeWidth="0.5"/>
          ))}
          {/* Roads */}
          <path d="M0,130 L380,130" stroke="#1e3a5f" strokeWidth="3"/>
          <path d="M190,0 L190,260" stroke="#1e3a5f" strokeWidth="3"/>
          <path d="M0,80 L380,180" stroke="#1e3a5f" strokeWidth="2"/>
          {/* You */}
          <motion.circle cx="190" cy="130" r="8" fill="#e85d7a"
            animate={{ r:[8,14,8], opacity:[1,0.3,1] }} transition={{ duration: 1.8, repeat: Infinity }}/>
          <circle cx="190" cy="130" r="5" fill="#e85d7a"/>

          {/* Incident dots */}
          {visible.map(inc => (
            <g key={inc.id} onClick={() => setSelected(selected === inc.id ? null : inc.id)} style={{ cursor: "pointer" }}>
              <motion.circle
                cx={inc.x} cy={inc.y} r={8 + inc.count}
                fill={inc.color} opacity={0.15}
                animate={{ r: [8+inc.count, 12+inc.count, 8+inc.count] }}
                transition={{ duration: 2, repeat: Infinity, delay: inc.id * 0.3 }}
              />
              <circle cx={inc.x} cy={inc.y} r="7" fill={inc.color} opacity={0.9}/>
              <text x={inc.x} y={inc.y+4} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">
                {inc.count}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
          {[{c:"#e85d7a",l:"Harassment"},{c:"#fbbf24",l:"Lighting"},{c:"#f97316",l:"Suspicious"}].map(l=>(
            <div key={l.l} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{background:l.c}}/>
              <span className="text-[10px] text-slate-400">{l.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected incident */}
      {selInc && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-3 rounded-2xl p-4 border border-white/20"
          style={{ background: "#111827" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background: selInc.color }}/>
            <span className="font-semibold text-white text-sm">{selInc.label}</span>
            <span className="text-xs text-slate-400 ml-auto">{selInc.time}</span>
          </div>
          <p className="text-xs text-slate-400">Reported {selInc.count} time{selInc.count > 1 ? "s" : ""} in this area. Tap to report a new incident here.</p>
        </motion.div>
      )}

      {/* Recent reports */}
      <div className="flex-1 overflow-y-auto px-4 mt-4 pb-24">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Reports</h3>
        <div className="flex flex-col gap-2">
          {INCIDENTS.slice().reverse().map(inc => (
            <div key={inc.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10" style={{ background: "#111827" }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: inc.color }}/>
              <span className="text-sm text-white">{inc.label}</span>
              <span className="text-xs text-slate-500 ml-auto">{inc.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
