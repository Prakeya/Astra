import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, X, MapPin, Clock, AlertTriangle, Shield, Camera } from "lucide-react";
import { useState } from "react";

const INCIDENTS = [
  { id: 1, type: "harassment", label: "Harassment", x: 140, y: 90, color: "#e85d7a", time: "2h ago", count: 3, severity: "High",
    description: "Multiple women reported being followed near the underpass. The area has poor visibility especially after 8 PM. Police patrol has been alerted.",
    location: "Station Road Underpass", reporter: "Anonymous", hasPhoto: true },
  { id: 2, type: "lighting", label: "Poor Lighting", x: 240, y: 130, color: "#fbbf24", time: "5h ago", count: 7, severity: "Medium",
    description: "The streetlights on this stretch have been non-functional for 3 weeks. Visibility is extremely poor at night. Municipal complaint filed.",
    location: "MG Road, near Bus Stop 14", reporter: "Anonymous", hasPhoto: false },
  { id: 3, type: "suspicious", label: "Suspicious Activity", x: 80, y: 150, color: "#f97316", time: "1d ago", count: 2, severity: "Medium",
    description: "Two individuals observed following pedestrians on foot. They were seen near the temple parking lot after dark.",
    location: "Temple Rd, Parking Area", reporter: "Anonymous", hasPhoto: true },
  { id: 4, type: "unsafe_path", label: "Unsafe Path", x: 300, y: 80, color: "#a78bfa", time: "6h ago", count: 4, severity: "High",
    description: "This lane is unlit and has no active shops or residents. Strongly advised to avoid after sunset.",
    location: "Cross Lane 4B, Sector 7", reporter: "Anonymous", hasPhoto: false },
  { id: 5, type: "lighting", label: "Poor Lighting", x: 190, y: 170, color: "#fbbf24", time: "3h ago", count: 5, severity: "Low",
    description: "Half the street lamps are out. Women have reported feeling unsafe while walking after 9 PM.",
    location: "Park Street, North End", reporter: "Anonymous", hasPhoto: true },
  { id: 6, type: "harassment", label: "Harassment", x: 330, y: 150, color: "#e85d7a", time: "30m ago", count: 1, severity: "High",
    description: "Just reported — verbal harassment near the auto stand. Astra guardians in the area have been notified.",
    location: "City Auto Stand, East Gate", reporter: "Anonymous", hasPhoto: false },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "harassment", label: "Harassment" },
  { key: "lighting", label: "Lighting" },
  { key: "suspicious", label: "Suspicious" },
  { key: "unsafe_path", label: "Unsafe Path" },
];

const SEVERITY_COLOR: Record<string, string> = { High: "#e85d7a", Medium: "#f97316", Low: "#fbbf24" };

export function IncidentMap() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<typeof INCIDENTS[0] | null>(null);

  const visible = filter === "all" ? INCIDENTS : INCIDENTS.filter(i => i.type === filter);

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#09111f" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Incident Map</h1>
          <p className="text-xs text-slate-400">Community-reported safety data</p>
        </div>
        <span className="ml-auto text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-1 rounded-full font-medium">
          {INCIDENTS.length} reports
        </span>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} data-testid={`filter-${f.key}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.key ? "bg-primary text-white" : "bg-white/10 text-slate-300"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="relative mx-4 rounded-2xl overflow-hidden border border-white/10" style={{ height: 240, background: "linear-gradient(135deg, #0f172a, #0a1628)" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 240">
          {[40,80,120,160,200,240,280,320,360].map(x=>(
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="240" stroke="#1e3a5f" strokeWidth="0.5"/>
          ))}
          {[40,80,120,160,200].map(y=>(
            <line key={`h${y}`} x1="0" y1={y} x2="380" y2={y} stroke="#1e3a5f" strokeWidth="0.5"/>
          ))}
          <path d="M0,120 L380,120" stroke="#2a5a8a" strokeWidth="3" opacity="0.6"/>
          <path d="M190,0 L190,240" stroke="#2a5a8a" strokeWidth="3" opacity="0.6"/>
          <path d="M0,70 L380,170" stroke="#2a5a8a" strokeWidth="2" opacity="0.4"/>

          {/* You */}
          <motion.circle cx="190" cy="120" r="10" fill="rgba(232,93,122,0.2)"
            animate={{ r:[10,18,10], opacity:[0.7,0.1,0.7] }} transition={{ duration: 2, repeat: Infinity }}/>
          <circle cx="190" cy="120" r="5" fill="#e85d7a"/>
          <text x="190" y="108" textAnchor="middle" fontSize="8" fill="#e85d7a">You</text>

          {/* Incident dots */}
          {visible.map(inc => (
            <g key={inc.id} onClick={() => setSelected(selected?.id === inc.id ? null : inc)} style={{ cursor:"pointer" }}>
              <motion.circle cx={inc.x} cy={inc.y} r={10 + inc.count * 1.5} fill={inc.color} opacity={0.12}
                animate={{ r:[10+inc.count,14+inc.count,10+inc.count] }}
                transition={{ duration:2.2, repeat:Infinity, delay:inc.id*0.3 }}/>
              <circle cx={inc.x} cy={inc.y} r="9" fill={inc.color} opacity={0.9}
                stroke={selected?.id === inc.id ? "white" : "none"} strokeWidth="2"/>
              <text x={inc.x} y={inc.y+4} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">
                {inc.count}
              </text>
            </g>
          ))}
        </svg>
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
          {[{c:"#e85d7a",l:"Harassment"},{c:"#fbbf24",l:"Lighting"},{c:"#f97316",l:"Suspicious"},{c:"#a78bfa",l:"Unsafe"}].map(l=>(
            <div key={l.l} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{background:l.c}}/>
              <span className="text-[9px] text-slate-400">{l.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reports list */}
      <div className="flex-1 overflow-y-auto px-4 mt-4 pb-24">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Reports</h3>
        <div className="flex flex-col gap-2">
          {INCIDENTS.slice().reverse().map(inc => (
            <button key={inc.id} onClick={() => setSelected(inc)}
              className="flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:border-white/20"
              style={{ background: selected?.id === inc.id ? "rgba(232,93,122,0.08)" : "#111827",
                       borderColor: selected?.id === inc.id ? "rgba(232,93,122,0.3)" : "rgba(255,255,255,0.08)" }}>
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: inc.color }}/>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium">{inc.label}</div>
                <div className="text-xs text-slate-500 truncate">{inc.location}</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs text-slate-500">{inc.time}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: `${SEVERITY_COLOR[inc.severity]}18`, color: SEVERITY_COLOR[inc.severity] }}>
                  {inc.severity}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Report Slide-up */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-black/60"/>
            <motion.div initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
              transition={{ type:"spring", damping:30, stiffness:300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 rounded-t-3xl overflow-hidden border-t border-white/10"
              style={{ background: "#111827" }}>

              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20"/>
              </div>

              <div className="px-5 pb-8 pt-3 max-h-[75vh] overflow-y-auto">
                {/* Type badge + close */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: selected.color }}/>
                    <span className="text-sm font-bold text-white">{selected.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium ml-1"
                      style={{ background: `${SEVERITY_COLOR[selected.severity]}18`, color: SEVERITY_COLOR[selected.severity] }}>
                      {selected.severity} severity
                    </span>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-full hover:bg-white/10">
                    <X size={18} className="text-slate-400"/>
                  </button>
                </div>

                {/* Location + time */}
                <div className="flex gap-3 mb-4">
                  <div className="flex items-start gap-2 flex-1 p-3 rounded-xl border border-white/10" style={{ background:"#0d1525" }}>
                    <MapPin size={14} className="text-primary mt-0.5 shrink-0"/>
                    <span className="text-xs text-slate-300 leading-relaxed">{selected.location}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-white/10" style={{ background:"#0d1525" }}>
                    <Clock size={14} className="text-slate-400"/>
                    <span className="text-xs text-slate-300">{selected.time}</span>
                  </div>
                </div>

                {/* Photo placeholder */}
                {selected.hasPhoto && (
                  <div className="rounded-2xl overflow-hidden mb-4 border border-white/10" style={{ background:"#0d1525", height:140 }}>
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Camera size={28} className="text-slate-600"/>
                      <span className="text-xs text-slate-500">Photo submitted with report</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-slate-200 leading-relaxed">{selected.description}</p>
                </div>

                {/* Stats row */}
                <div className="flex gap-3 mb-5">
                  {[
                    { icon:<AlertTriangle size={13}/>, label:"Reports", val: selected.count.toString() },
                    { icon:<Shield size={13}/>, label:"Guardians alerted", val:"3" },
                    { icon:<Clock size={13}/>, label:"Reported", val:selected.time },
                  ].map(s => (
                    <div key={s.label} className="flex-1 rounded-xl p-2.5 border border-white/10 text-center" style={{ background:"#0d1525" }}>
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">{s.icon}</div>
                      <div className="text-sm font-bold text-white">{s.val}</div>
                      <div className="text-[10px] text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Reporter */}
                <p className="text-xs text-slate-500 text-center mb-4">Submitted by: {selected.reporter}</p>

                <button className="w-full h-12 rounded-full font-semibold text-white text-sm"
                  style={{ background:"linear-gradient(135deg, #e85d7a, #c23a5a)" }}
                  onClick={() => { setSelected(null); setLocation("/report"); }}>
                  + Report another incident here
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
