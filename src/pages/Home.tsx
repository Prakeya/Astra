import { useState, useEffect } from "react";
import { GoogleMap } from "@/components/GoogleMap";
import { useLocation } from "wouter";
import { Shield, MapPin, Users, Bell, Navigation, RefreshCw, EyeOff, AlertTriangle, CheckCircle2, ChevronRight, Compass } from "lucide-react";
import { StarryBackground } from "@/components/StarryBackground";
import { getMapCenterFromUser } from "@/lib/indiaStates";

interface Marker {
  position: { lat: number; lng: number };
  title: string;
  color: string;
}

export function Home() {
  const [, setLocation] = useLocation();
  const [center, setCenter] = useState({ lat: 11.1271, lng: 78.6569 }); // Default Tamil Nadu
  const [mapExpanded, setMapExpanded] = useState(false);

  useEffect(() => {
    const userCenter = getMapCenterFromUser();
    setCenter(userCenter);
  }, []);

  const markers: Marker[] = [
    { position: { lat: center.lat, lng: center.lng }, title: "You are here", color: "#06b6d4" }, // Person standing dot
    { position: { lat: center.lat + 0.005, lng: center.lng + 0.005 }, title: "Safe Corridor", color: "#0d9488" },
    { position: { lat: center.lat - 0.004, lng: center.lng + 0.003 }, title: "Dimly Lit Street", color: "#d97706" },
    { position: { lat: center.lat + 0.002, lng: center.lng - 0.005 }, title: "Low Activity Zone", color: "#e11d48" },
    { position: { lat: center.lat - 0.002, lng: center.lng - 0.003 }, title: "Patrolled Area", color: "#0d9488" },
    { position: { lat: center.lat + 0.006, lng: center.lng - 0.002 }, title: "Construction Warning", color: "#e11d48" },
  ];

  const safeCount = markers.filter(m => m.color === "#0d9488").length;
  const cautionCount = markers.filter(m => m.color === "#d97706").length;
  const alertCount = markers.filter(m => m.color === "#e11d48").length;

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#e0f2fe] overflow-hidden relative">
      {/* Dreamscape Backdrop Layer */}
      <StarryBackground />

      {/* Cinematic Top Header - Glassmorphic light theme */}
      <div className="px-5 pt-12 pb-4 bg-white/45 backdrop-blur-md border-b border-[#085a70]/10 z-20 shrink-0 shadow-sm">
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
          
          <div className="flex gap-1.5">
            <button className="bg-white/60 hover:bg-white/80 text-[#085a70] p-2.5 rounded-2xl border border-[#085a70]/10 shadow-sm transition-all flex items-center justify-center">
              <RefreshCw size={14} />
            </button>
            <button className="bg-white/60 hover:bg-white/80 text-[#085a70] px-3.5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider border border-[#085a70]/10 shadow-sm transition-all flex items-center gap-1">
              <EyeOff size={12} />
              <span>Hide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container - Non-overlapping and beautifully scrollable */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-4 relative z-10">
        
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
            <div className="bg-white/95 backdrop-blur-md border border-teal-500/10 px-2.5 py-1 rounded-full text-[9px] font-black text-[#0d9488] flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#0d9488] rounded-full" />
              <span>{safeCount} Safe</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md border border-amber-500/10 px-2.5 py-1 rounded-full text-[9px] font-black text-[#d97706] flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" />
              <span>{cautionCount} Caution</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md border border-rose-500/10 px-2.5 py-1 rounded-full text-[9px] font-black text-[#e11d48] flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#e11d48] rounded-full" />
              <span>{alertCount} Alert</span>
            </div>
          </div>
        </div>

        {/* Safety Stats Card (Premium Dreamscape glassmorphism) */}
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

          {/* Sophisticated Segmented Progress Bar */}
          <div className="flex h-1.5 rounded-full overflow-hidden bg-[#085a70]/10">
            <div className="bg-[#0d9488] transition-all duration-500" style={{ width: `${(safeCount / markers.length) * 100}%` }} />
            <div className="bg-[#d97706] transition-all duration-500" style={{ width: `${(cautionCount / markers.length) * 100}%` }} />
            <div className="bg-[#e11d48] transition-all duration-500" style={{ width: `${(alertCount / markers.length) * 100}%` }} />
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-[#083344]/80 leading-relaxed justify-center bg-[#d97706]/10 px-3 py-2 rounded-2xl border border-[#d97706]/10">
            <AlertTriangle size={12} className="text-[#d97706] shrink-0" />
            <span>Multiple alert zones active — stay on well-lit paths</span>
          </div>
        </div>

        {/* Start Walking Button - Deep Dream-Teal Gradient Capsule */}
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

        {/* Check-in recommendation */}
        <div className="bg-white/55 backdrop-blur-md border border-[#085a70]/10 rounded-3xl p-3.5 flex items-center gap-3 shrink-0 text-[#083344]">
          <div className="w-9 h-9 bg-[#d97706]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#d97706]/10">
            <Bell size={15} className="text-[#d97706]" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider">Scheduled Check-in Advice</div>
            <div className="text-[10px] text-[#083344]/70 mt-0.5">Check-in timer is highly recommended for late-night walks.</div>
          </div>
        </div>

        {/* Last walk info */}
        <div className="bg-white/55 backdrop-blur-md border border-[#085a70]/10 rounded-3xl p-3.5 flex items-center justify-between shrink-0 text-[#083344]">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 bg-[#0d9488]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#0d9488]/10">
              <CheckCircle2 size={15} className="text-[#0d9488]" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider">Last: Home → College</div>
              <div className="text-[9px] text-[#083344]/60 mt-0.5 font-mono">12 MIN · 3 GUARDIANS · VERIFIED SECURE</div>
            </div>
          </div>
          <button 
            onClick={() => setLocation("/walk")}
            className="text-[#085a70] text-[9px] font-black uppercase tracking-wider bg-[#085a70]/10 px-3 py-1.5 rounded-full border border-[#085a70]/10"
          >
            Again
          </button>
        </div>

      </div>
    </div>
  );
}
