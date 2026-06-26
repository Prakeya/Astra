import { Link, useLocation } from "wouter";
import { Home, Map, AlertCircle, User } from "lucide-react";
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
    { icon: <Home size={22} />, label: "Home", href: "/home" },
    { icon: <Map size={22} />, label: "Map", href: "/walk" },
    { icon: <AlertCircle size={22} />, label: "SOS", href: "/sos", isSOS: true },
    { icon: <User size={22} />, label: "Profile", href: "/profile" },
  ];

  return (
    <>
      <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} />
      
      <div className="fixed bottom-0 w-full max-w-[430px] bg-white/95 backdrop-blur-lg border-t border-indigo-100 px-4 py-3 pb-safe flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {navItems.map((item) => {
          if (item.isSOS) {
            return (
              <div key="sos" className="relative flex flex-col items-center">
                {showSOSToast && (
                  <div className="absolute -top-10 bg-rose-500 text-white text-xs py-1.5 px-3 rounded-full shadow-lg whitespace-nowrap">
                    Hold for SOS
                  </div>
                )}
                <button
                  onMouseDown={handleSOSStart}
                  onMouseUp={handleSOSEnd}
                  onMouseLeave={handleSOSEnd}
                  onTouchStart={handleSOSStart}
                  onTouchEnd={handleSOSEnd}
                  className="flex flex-col items-center gap-0.5 relative"
                >
                  <div className="relative">
                    {sosProgress > 0 && (
                      <svg className="absolute -inset-2 w-10 h-10 -rotate-90">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="113" strokeDashoffset={113 - (113 * sosProgress) / 100} />
                      </svg>
                    )}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
                      <AlertCircle size={22} className="text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-rose-500">SOS</span>
                </button>
              </div>
            );
          }

          const isActive = location === item.href || (item.href !== "/home" && location.startsWith(item.href));
          
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`flex flex-col items-center gap-0.5 ${isActive ? "text-rose-500" : "text-slate-400"}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-rose-50" : ""}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-semibold ${isActive ? "text-rose-500" : "text-slate-400"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}