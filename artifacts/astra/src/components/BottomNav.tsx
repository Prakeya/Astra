import { Link, useLocation } from "wouter";
import { Menu, Map, AlertCircle, User } from "lucide-react";
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

  return (
    <>
      <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} />
      
      <div className="fixed bottom-0 w-full max-w-[430px] bg-background/80 backdrop-blur-md border-t border-border px-6 py-4 pb-safe flex justify-between items-center z-40">
        <button 
          onClick={() => setMenuOpen(true)}
          className={`flex flex-col items-center gap-1 ${menuOpen ? "text-primary" : "text-muted-foreground"}`}
          data-testid="nav-menu"
        >
          <Menu size={24} />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
        
        <Link href="/home" className={`flex flex-col items-center gap-1 ${location === "/home" || location === "/walk" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-map">
          <Map size={24} />
          <span className="text-[10px] font-medium">Map</span>
        </Link>
        
        <div className="relative flex flex-col items-center">
          {showSOSToast && (
            <div className="absolute -top-10 bg-card text-xs py-1 px-3 rounded-full border border-border whitespace-nowrap text-card-foreground">
              Hold for SOS
            </div>
          )}
          <button
            onMouseDown={handleSOSStart}
            onMouseUp={handleSOSEnd}
            onMouseLeave={handleSOSEnd}
            onTouchStart={handleSOSStart}
            onTouchEnd={handleSOSEnd}
            className="flex flex-col items-center gap-1 text-destructive relative"
            data-testid="nav-sos"
          >
            <div className="relative">
              {sosProgress > 0 && (
                <svg className="absolute -inset-2 w-10 h-10 -rotate-90">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" strokeDasharray="113" strokeDashoffset={113 - (113 * sosProgress) / 100} />
                </svg>
              )}
              <AlertCircle size={24} />
            </div>
            <span className="text-[10px] font-medium">SOS</span>
          </button>
        </div>
        
        <Link href="/profile" className={`flex flex-col items-center gap-1 ${location === "/profile" ? "text-primary" : "text-muted-foreground"}`} data-testid="nav-profile">
          <User size={24} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </>
  );
}
