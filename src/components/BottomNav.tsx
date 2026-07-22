import { Link, useLocation } from "wouter";
import { Home, Map, AlertCircle, User, Menu } from "lucide-react";
import { useState } from "react";
import { MenuDrawer } from "./MenuDrawer";

export function BottomNav() {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSOSToast, setShowSOSToast] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  
  if (location === "/" || location === "/sos" || location === "/guardian-onboarding" || location === "/create-account") {
    return null;
  }

  let timer: NodeJS.Timeout;
  let start: number;

  const handleSOSStart = () => {
    start = Date.now();
    timer = setInterval(() => {
      const p = Math.min(((Date.now() - start) / 2000) * 100, 100);
      setSosProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setLocation("/sos");
      }
    }, 50);
  };

  const handleSOSEnd = () => {
    clearInterval(timer);
    if (sosProgress > 0 && sosProgress < 100) {
      setShowSOSToast(true);
      setTimeout(() => setShowSOSToast(false), 2000);
    }
    setSosProgress(0);
  };

  const navItems = [
    { icon: <Menu size={20} />, label: "Menu", isMenu: true },
    { icon: <Map size={20} />, label: "Map", href: "/home" },
    { icon: <AlertCircle size={20} />, label: "SOS", href: "/sos", isSOS: true },
    { icon: <User size={20} />, label: "Profile", href: "/profile" },
  ];

  return (
    <>
      <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} />
      
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white/55 backdrop-blur-md border-t border-[#085a70]/10 px-4 py-3.5 pb-safe flex justify-between items-center z-40 shadow-[0_-8px_30px_rgba(8,90,112,0.04)]">
        {navItems.map((item) => {
          if (item.isMenu) {
            return (
              <button
                key="menu"
                onClick={() => setMenuOpen(true)}
                className={`flex flex-col items-center gap-1.5 ${menuOpen ? "text-[#085a70]" : "text-[#083344]/50"} hover:text-[#083344] transition-colors`}
              >
                <div className={`p-2 rounded-2xl transition-colors ${menuOpen ? "bg-[#085a70]/10 text-[#085a70]" : ""}`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${menuOpen ? "text-[#085a70]" : "text-[#083344]/50"}`}>{item.label}</span>
              </button>
            );
          }

          if (item.isSOS) {
            return (
              <div key="sos" className="relative flex flex-col items-center">
                {showSOSToast && (
                  <div className="absolute -top-11 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-3.5 rounded-full shadow-md whitespace-nowrap animate-bounce border border-rose-400/20">
                    Hold for SOS
                  </div>
                )}
                <button
                  onMouseDown={handleSOSStart}
                  onMouseUp={handleSOSEnd}
                  onMouseLeave={handleSOSEnd}
                  onTouchStart={handleSOSStart}
                  onTouchEnd={handleSOSEnd}
                  className="flex flex-col items-center gap-1 relative"
                >
                  <div className="relative">
                    {sosProgress > 0 && (
                      <svg className="absolute -inset-2 w-10 h-10 -rotate-90">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="113" strokeDashoffset={113 - (113 * sosProgress) / 100} />
                      </svg>
                    )}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 flex items-center justify-center shadow-md border border-rose-400/20 active:scale-95 transition-transform">
                      <AlertCircle size={20} className="text-white" />
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-rose-600">SOS</span>
                </button>
              </div>
            );
          }

          const isActive = location === item.href || (item.href !== "/home" && location.startsWith(item.href));
          
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`flex flex-col items-center gap-1.5 ${isActive ? "text-[#085a70]" : "text-[#083344]/50"} hover:text-[#083344] transition-colors`}
            >
              <div className={`p-2 rounded-2xl transition-colors ${isActive ? "bg-[#085a70]/10 text-[#085a70]" : ""}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "text-[#085a70]" : "text-[#083344]/50"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
