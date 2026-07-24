import { useState, useEffect, useMemo } from "react";
import { GoogleMap } from "@/components/GoogleMap";
import { useLocation } from "wouter";
import { Shield, MapPin, Users, Bell, Navigation, RefreshCw, EyeOff, AlertTriangle, CheckCircle2, ChevronRight, Compass, Sparkles, MessageSquare } from "lucide-react";
import { StarryBackground } from "@/components/StarryBackground";
import { getMapCenterFromUser } from "@/lib/indiaStates";
import { getComplaints, seedSampleComplaints, clearComplaints, calculateSafetyScore, type Complaint } from "@/lib/safetyStore";
import { subscribeToComplaints } from "@/lib/firebaseService";
import { AISafetyAssistantDrawer } from "@/components/AISafetyAssistantDrawer";

interface Marker {
  position: { lat: number; lng: number };
  title: string;
  color: string;
}

export function Home() {
  const [, setLocation] = useLocation();
  const [center, setCenter] = useState({ lat: 11.1271, lng: 78.6569 }); // Default Tamil Nadu
  const [mapExpanded, setMapExpanded] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [demoLoadedMessage, setDemoLoadedMessage] = useState<string | null>(null);

  const triggerDemoMessage = (msg: string) => {
    setDemoLoadedMessage(msg);
    setTimeout(() => setDemoLoadedMessage(null), 3000);
  };

  useEffect(() => {
    // Determine center
    const defaultCenter = getMapCenterFromUser();
    setCenter(defaultCenter);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => { /* ignore */ },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToComplaints((data) => {
      setComplaints(data);
    });
    return () => unsubscribe();
  }, []);

  const getSeverityColor = (severity: string) => {
    const s = severity.toLowerCase();
    if (s === "critical" || s === "high") return "#e11d48"; // Crimson alert
    if (s === "medium") return "#d97706"; // Amber caution
    return "#0d9488"; // Teal safe/low
  };

  const markers: Marker[] = useMemo(() => {
    const userMarker: Marker = { position: { lat: center.lat, lng: center.lng }, title: "You are here", color: "#06b6d4" };
    const complaintMarkers: Marker[] = complaints.map(c => ({
      position: { lat: c.lat, lng: c.lng },
      title: `${c.label}: ${c.description}`,
      color: getSeverityColor(c.severity)
    }));
    return [userMarker, ...complaintMarkers];
  }, [center, complaints]);

  const safeCount = complaints.filter(c => c.severity.toLowerCase() === "low").length;
  const cautionCount = complaints.filter(c => c.severity.toLowerCase() === "medium").length;
  const alertCount = complaints.filter(c => c.severity.toLowerCase() === "high" || c.severity.toLowerCase() === "critical").length;
  const totalReports = complaints.length;

  const safetyInfo = useMemo(() => calculateSafetyScore(complaints), [complaints]);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#e0f2fe] overflow-hidden relative">
      {/* Dreamscape Backdrop Layer */}
      <StarryBackground />

      {/* Cinematic Top Header - Glassmorphic light theme */}
      <div className="px-5 pt-12 pb-4 bg-white/45 backdrop-blur-md border-b border-[#085a70]/10 z-20 shrink-0 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-[0.25em] text-[#083344] uppercase font-sans">
              ASTRA
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-[11px] text-[#0f766e] font-extrabold uppercase tracking-wider">2 Active Guardians nearby</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider border border-cyan-400/30 shadow-xs transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} className="animate-pulse" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => setComplaints(getComplaints())}
              className="bg-white/60 hover:bg-white/80 text-[#085a70] p-2.5 rounded-2xl border border-[#085a70]/10 shadow-xs transition-all flex items-center justify-center"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-4 relative z-10">
        
        {/* Dynamic Safety Score Banner */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-4 text-white shadow-xl flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono font-black text-xl shadow-inner">
              {safetyInfo.score}
            </div>
            <div>
              <div className="text-[10px] text-cyan-300/70 font-mono font-bold uppercase tracking-widest">
                Dynamic Safety Index
              </div>
              <div className="text-sm font-black uppercase tracking-wider text-white">
                {safetyInfo.label}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {totalReports === 0 ? "Insufficient complaint data • Perimeter clear" : `${totalReports} community report(s) evaluated`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="p-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 rounded-2xl transition-all"
          >
            <MessageSquare size={18} />
          </button>
        </div>

        {/* Interactive Map Frame with Glass border */}
        <div 
          className={`relative rounded-[2.5rem] overflow-hidden border border-white/45 shadow-lg transition-all duration-300 ${
            mapExpanded ? "h-[360px]" : "h-[210px]"
          } bg-white/30 shrink-0`}
        >
          <GoogleMap 
            center={center}
            zoom={14}
            markers={markers}
            className="w-full h-full"
          />
          
          {/* Map Expand/Collapse Overlay Trigger */}
          <button 
            onClick={() => setMapExpanded(!mapExpanded)}
            className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-[#085a70]/10 text-[#085a70] px-3 py-2 rounded-full hover:bg-white transition-colors z-10 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest shadow-md"
          >
            <Compass size={12} className="animate-spin-slow" />
            <span>{mapExpanded ? "Minimize" : "Expand"}</span>
          </button>

          {/* Micro safety pill legend overlays */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-10 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md border border-teal-500/10 px-2.5 py-1 rounded-full text-[9px] font-black text-[#0d9488] flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 bg-[#0d9488] rounded-full" />
              <span>{safeCount} Safe</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md border border-amber-500/10 px-2.5 py-1 rounded-full text-[9px] font-black text-[#d97706] flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" />
              <span>{cautionCount} Caution</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md border border-rose-500/10 px-2.5 py-1 rounded-full text-[9px] font-black text-[#e11d48] flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 bg-[#e11d48] rounded-full" />
              <span>{alertCount} Alert</span>
            </div>
          </div>
        </div>

        {/* Area Safety Breakdown Card */}
        <div className="bg-white/55 backdrop-blur-md rounded-3xl p-4 border border-[#085a70]/10 shadow-[0_8px_30px_rgb(8,90,112,0.04)] relative overflow-hidden flex flex-col gap-3 shrink-0 text-[#083344]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-[#0d9488]" />
              <h3 className="font-extrabold text-[10px] uppercase tracking-wider font-sans">
                Area Safety Report
              </h3>
            </div>
            <span className="text-[9px] font-black tracking-widest text-[#0d9488] bg-[#0d9488]/10 px-2.5 py-1 rounded-full">LIVE SCAN</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white/45 rounded-2xl p-2.5 border border-[#085a70]/5 text-center">
              <div className="text-[#0d9488] text-lg font-black font-mono">{safeCount}</div>
              <div className="text-[9px] text-[#083344]/70 uppercase font-black tracking-wider">Safe</div>
            </div>
            <div className="bg-white/45 rounded-2xl p-2.5 border border-[#085a70]/5 text-center">
              <div className="text-[#d97706] text-lg font-black font-mono">{cautionCount}</div>
              <div className="text-[9px] text-[#083344]/70 uppercase font-black tracking-wider">Caution</div>
            </div>
            <div className="bg-white/45 rounded-2xl p-2.5 border border-[#085a70]/5 text-center">
              <div className="text-[#e11d48] text-lg font-black font-mono">{alertCount}</div>
              <div className="text-[9px] text-[#083344]/70 uppercase font-black tracking-wider">Alert</div>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="flex h-1.5 rounded-full overflow-hidden bg-[#085a70]/10">
            <div className="bg-[#0d9488] transition-all duration-500" style={{ width: `${totalReports > 0 ? (safeCount / totalReports) * 100 : 100}%` }} />
            <div className="bg-[#d97706] transition-all duration-500" style={{ width: `${totalReports > 0 ? (cautionCount / totalReports) * 100 : 0}%` }} />
            <div className="bg-[#e11d48] transition-all duration-500" style={{ width: `${totalReports > 0 ? (alertCount / totalReports) * 100 : 0}%` }} />
          </div>

          {totalReports > 0 ? (
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#083344]/80 leading-relaxed justify-center bg-[#d97706]/10 px-3 py-2 rounded-2xl border border-[#d97706]/10">
              <AlertTriangle size={12} className="text-[#d97706] shrink-0" />
              <span>{alertCount + cautionCount} active report zones — stay on well-lit paths</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-800 leading-relaxed justify-center bg-emerald-500/10 px-3 py-2 rounded-2xl border border-emerald-500/10">
              <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
              <span>No complaints reported nearby — area is clear!</span>
            </div>
          )}
        </div>

        {/* Toast Notification for Demo Data Actions */}
        {demoLoadedMessage && (
          <div className="bg-teal-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold text-center shadow-lg border border-teal-400 animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            <span>{demoLoadedMessage}</span>
          </div>
        )}

        {/* Sandbox Mobile Test Panel */}
        <div className="bg-slate-900/95 text-slate-100 rounded-3xl p-4 border border-slate-800 shadow-xl flex flex-col gap-2.5 shrink-0 select-none">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-cyan-400">Sandbox Mobile Test Panel</span>
            </div>
            <span className="text-[8px] font-mono font-black bg-slate-800 px-2 py-0.5 rounded text-slate-400">DEMO CONSOLE</span>
          </div>
          <p className="text-[9px] text-slate-400 font-bold leading-normal">
            To test on your phone, you can start with a clean empty slate (default) and submit reports, or click below to load sample demo incidents:
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                seedSampleComplaints(center);
                triggerDemoMessage("Demo incidents loaded successfully.");
              }}
              className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md shadow-cyan-950/40"
            >
              Load Demo Data
            </button>
            <button
              onClick={() => {
                clearComplaints();
                triggerDemoMessage("All safety reports cleared.");
              }}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-300 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all"
            >
              Clear All Reports
            </button>
          </div>
        </div>

        {/* Start Walking Button */}
        <button 
          onClick={() => setLocation("/walk")}
          className="w-full text-white py-4.5 px-6 rounded-full font-black flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all shrink-0 text-xs tracking-widest uppercase border border-teal-500/10"
          style={{ 
            background: "linear-gradient(135deg, #0d9488, #085a70)",
            boxShadow: "0 10px 20px -8px rgba(8,90,112,0.35)"
          }}
        >
          <Navigation size={13} className="text-white fill-current" />
          <span>Start Walking Securely</span>
        </button>

      </div>

      <AISafetyAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />
    </div>
  );
}
