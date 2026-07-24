import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Star, MapPin, Shield, Clock, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { subscribeToGuardians, toggleGuardianStatusService } from "@/lib/firebaseService";
import { GuardianLocation } from "@/types/safety";

const BADGE_COLOR: Record<string, string> = {
  "Community": "#2563eb",
  "Verified": "#16a34a",
  "Police-Verified": "#7c3aed",
};

export function GuardiansNearby() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState("All");
  const [liveGuardians, setLiveGuardians] = useState<GuardianLocation[]>([]);
  const [isGuardianActive, setIsGuardianActive] = useState<boolean>(() => {
    return localStorage.getItem("astra_guardian_active") === "true";
  });

  useEffect(() => {
    const unsubscribe = subscribeToGuardians((data) => {
      setLiveGuardians(data);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleGuardian = async () => {
    const next = !isGuardianActive;
    setIsGuardianActive(next);
    localStorage.setItem("astra_guardian_active", String(next));
    await toggleGuardianStatusService(next, 11.127, 78.657, 2.5);
  };

  // Live guardians from Firestore / active state
  const combinedGuardians = liveGuardians.map((g) => ({
    id: g.uid,
    name: g.displayName || "Community Guardian",
    distance: "110m",
    eta: "3 min",
    badge: "🛡️",
    level: "Police-Verified",
    rating: g.trustRating || 4.9,
    helps: 15,
    status: g.available ? "active" : "offline",
    available: "Live Active"
  }));

  const filtered = filter === "All" ? combinedGuardians : combinedGuardians.filter(g => g.level === filter);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-[#083344] font-sans">
      <div className="flex items-center justify-between px-4 py-4 pt-12 border-b border-[#085a70]/10 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-slate-100 transition-colors" data-testid="btn-back">
            <ArrowLeft size={20} className="text-[#083344]"/>
          </button>
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider text-[#083344]">Guardians Nearby</h1>
            <p className="text-xs font-medium text-[#085a70]/70">{filtered.length} units in range</p>
          </div>
        </div>

        <button
          onClick={handleToggleGuardian}
          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs ${
            isGuardianActive
              ? "bg-emerald-500 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          <Shield size={12} />
          <span>{isGuardianActive ? "Active Mode" : "Become Guardian"}</span>
        </button>
      </div>

      {/* Map preview */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden border border-[#085a70]/10 shadow-sm"
           style={{ height: 160, background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 160">
          {/* Grid lines */}
          {[40,80,120,160,200,240,280,320].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#e2e8f0" strokeWidth="0.5"/>
          ))}
          {[40,80,120].map(y => (
            <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="#e2e8f0" strokeWidth="0.5"/>
          ))}
          {/* Roads */}
          <path d="M0,80 L380,80" stroke="#cbd5e1" strokeWidth="3"/>
          <path d="M190,0 L190,160" stroke="#cbd5e1" strokeWidth="3"/>
          {/* You */}
          <motion.circle cx="190" cy="80" r="8" fill="#ef4444"
            animate={{ r: [8,14,8], opacity: [1,0.3,1] }}
            transition={{ duration: 1.8, repeat: Infinity }}/>
          <circle cx="190" cy="80" r="5" fill="#ef4444"/>
          {/* Guardian dots */}
          {filtered.length > 0 && [{cx:145,cy:62},{cx:220,cy:95},{cx:170,cy:108},{cx:255,cy:72},{cx:130,cy:100}].slice(0, filtered.length).map((g,i) => (
            <g key={i}>
              <motion.circle cx={g.cx} cy={g.cy} r="6" fill="#0d9488"
                animate={{ r: [6,10,6], opacity: [0.6,0.2,0.6] }}
                transition={{ duration: 2, delay: i*0.3, repeat: Infinity }}/>
              <circle cx={g.cx} cy={g.cy} r="4" fill="#0d9488"/>
            </g>
          ))}
        </svg>
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1 shadow-sm border border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{filtered.length} guardians synced</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 mt-4 overflow-x-auto pb-1">
        {["All", "Community", "Verified", "Police-Verified"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            data-testid={`filter-${f.toLowerCase()}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${filter === f ? "bg-[#0d9488] border-[#0d9488] text-white" : "bg-white border-[#085a70]/10 text-[#085a70]/80 hover:bg-slate-50"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 mt-4 pb-24 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <Shield size={36} className="text-teal-600 mx-auto mb-3 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-wider text-[#083344]">Waiting for nearby guardians...</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              No active community guardians found in range. Click "Become Guardian" to activate patrol mode.
            </p>
          </div>
        ) : (
          filtered.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-4 border border-[#085a70]/10 bg-white shadow-sm"
            data-testid={`guardian-card-${g.id}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 bg-slate-100 border border-slate-200/50">
                {g.badge}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#083344] text-xs uppercase tracking-wider">{g.name}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full`}
                        style={{ background: BADGE_COLOR[g.level]+"15", color: BADGE_COLOR[g.level] }}>
                    {g.level}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <MapPin size={11} className="text-slate-400"/> {g.distance}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <Clock size={11} className="text-slate-400"/> {g.eta}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 uppercase tracking-wide">
                    <Star size={11} fill="currentColor"/> {g.rating}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{g.helps} helps</span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{g.available}</span>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${g.status === "active" ? "bg-emerald-500" : "bg-slate-300"}`}/>
            </div>
          </motion.div>
        ))
        )}
      </div>
    </div>
  );
}

