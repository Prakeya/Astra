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
    <div className="min-h-[100dvh] flex flex-col bg-[#e0f2fe] text-[#083344]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-[#085a70]/10 bg-white/45 backdrop-blur-md">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-slate-100/50 transition-colors" data-testid="btn-back">
          <ArrowLeft size={20} className="text-[#083344]"/>
        </button>
        <div>
          <h1 className="text-lg font-black uppercase tracking-wider text-[#083344]">Incident Map</h1>
          <p className="text-xs text-[#085a70]/80 font-bold uppercase tracking-widest">Community-reported safety data</p>
        </div>
        <span className="ml-auto text-xs bg-teal-500/10 border border-teal-500/20 text-[#0d9488] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
          {INCIDENTS.length} reports
        </span>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} data-testid={`filter-${f.key}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors border ${filter === f.key ? "bg-[#0d9488] border-[#0d9488] text-white" : "bg-white border-[#085a70]/10 text-[#083344]/70 hover:bg-white"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="relative mx-4 rounded-[2rem] overflow-hidden border border-[#085a70]/10 shadow-sm" style={{ height: 240, background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 240">
          {[40,80,120,160,200,240,280,320,360].map(x=>(
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="240" stroke="#cbd5e1" strokeWidth="0.5"/>
          ))}
          {[40,80,120,160,200].map(y=>(
            <line key={`h${y}`} x1="0" y1={y} x2="380" y2={y} stroke="#cbd5e1" strokeWidth="0.5"/>
          ))}
          <path d="M0,120 L380,120" stroke="#94a3b8" strokeWidth="3" opacity="0.6"/>
          <path d="M190,0 L190,240" stroke="#94a3b8" strokeWidth="3" opacity="0.6"/>
          <path d="M0,70 L380,170" stroke="#94a3b8" strokeWidth="2" opacity="0.4"/>

          {/* You */}
          <motion.circle cx="190" cy="120" r="10" fill="rgba(232,93,122,0.2)"
            animate={{ r:[10,18,10], opacity:[0.7,0.1,0.7] }} transition={{ duration: 2, repeat: Infinity }}/>
          <circle cx="190" cy="120" r="5" fill="#e85d7a"/>
          <text x="190" y="108" textAnchor="middle" fontSize="8" fill="#e85d7a" fontWeight="bold">You</text>

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
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 bg-white/70 backdrop-blur-xs p-1.5 rounded-lg border border-slate-200">
          {[{c:"#e85d7a",l:"Harassment"},{c:"#fbbf24",l:"Lighting"},{c:"#f97316",l:"Suspicious"},{c:"#a78bfa",l:"Unsafe"}].map(l=>(
            <div key={l.l} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{background:l.c}}/>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#083344]">{l.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reports list */}
      <div className="flex-1 overflow-y-auto px-4 mt-4 pb-24">
        <h3 className="text-sm font-black text-[#083344] uppercase tracking-wider mb-3">Recent Reports</h3>
        <div className="flex flex-col gap-2">
          {INCIDENTS.slice().reverse().map(inc => (
            <button key={inc.id} onClick={() => setSelected(inc)}
              className="flex items-center gap-3 p-4 rounded-[1.8rem] border text-left transition-all hover:border-[#085a70]/20"
              style={{ background: selected?.id === inc.id ? "rgba(13,148,136,0.08)" : "rgba(255,255,255,0.55)",
                       borderColor: selected?.id === inc.id ? "rgba(13,148,136,0.3)" : "rgba(8,90,112,0.08)" }}>
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: inc.color }}/>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#083344] font-black uppercase tracking-wide">{inc.label}</div>
                <div className="text-[11px] text-[#085a70]/80 font-semibold truncate mt-0.5">{inc.location}</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[10px] text-[#085a70]/60 font-black">{inc.time}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider"
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
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs"/>
            <motion.div initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
              transition={{ type:"spring", damping:30, stiffness:300 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 rounded-t-[2.5rem] overflow-hidden border-t border-[#085a70]/15"
              style={{ background: "#ffffff" }}>

              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-slate-200"/>
              </div>

              <div className="px-5 pb-8 pt-3 max-h-[75vh] overflow-y-auto">
                {/* Type badge + close */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: selected.color }}/>
                    <span className="text-sm font-black text-[#083344] uppercase tracking-wider">{selected.label}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest ml-1"
                      style={{ background: `${SEVERITY_COLOR[selected.severity]}18`, color: SEVERITY_COLOR[selected.severity] }}>
                      {selected.severity} severity
                    </span>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
                    <X size={18} className="text-slate-500"/>
                  </button>
                </div>

                {/* Location + time */}
                <div className="flex gap-3 mb-4">
                  <div className="flex items-start gap-2 flex-1 p-3.5 rounded-2xl border border-[#085a70]/10 bg-slate-50/50">
                    <MapPin size={14} className="text-[#0d9488] mt-0.5 shrink-0"/>
                    <span className="text-xs text-[#083344] leading-relaxed font-semibold">{selected.location}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-[#085a70]/10 bg-slate-50/50">
                    <Clock size={14} className="text-slate-400"/>
                    <span className="text-xs text-[#083344] font-semibold">{selected.time}</span>
                  </div>
                </div>

                {/* Photo placeholder */}
                {selected.hasPhoto && (
                  <div className="rounded-3xl overflow-hidden mb-4 border border-[#085a70]/10 bg-slate-50/50" style={{ height: 140 }}>
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Camera size={28} className="text-[#085a70]/40"/>
                      <span className="text-xs text-[#085a70]/60 font-bold uppercase tracking-widest">Photo submitted with report</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-[10px] font-black text-[#085a70]/60 uppercase tracking-widest mb-2">Description</h4>
                  <p className="text-xs text-[#083344] leading-relaxed font-semibold">{selected.description}</p>
                </div>

                {/* Stats row */}
                <div className="flex gap-3 mb-5">
                  {[
                    { icon:<AlertTriangle size={13}/>, label:"Reports", val: selected.count.toString() },
                    { icon:<Shield size={13}/>, label:"Guardians alerted", val:"3" },
                    { icon:<Clock size={13}/>, label:"Reported", val:selected.time },
                  ].map(s => (
                    <div key={s.label} className="flex-1 rounded-2xl p-2.5 border border-[#085a70]/10 text-center bg-slate-50/50">
                      <div className="flex items-center justify-center gap-1 text-[#085a70] mb-1">{s.icon}</div>
                      <div className="text-sm font-black text-[#083344] font-mono">{s.val}</div>
                      <div className="text-[8px] text-[#085a70]/70 font-black uppercase tracking-widest mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Reporter */}
                <p className="text-[10px] text-[#085a70]/60 font-black uppercase tracking-widest text-center mb-4">Submitted by: {selected.reporter}</p>

                <button className="w-full h-12 rounded-full font-black text-white text-xs uppercase tracking-widest shadow-lg border border-teal-500/10"
                  style={{ background:"linear-gradient(135deg, #0d9488, #085a70)" }}
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
