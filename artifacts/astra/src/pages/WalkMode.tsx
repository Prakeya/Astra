import { MapBackground } from "@/components/MapBackground";
import { SOSButton } from "@/components/SOSButton";
import { Button } from "@/components/ui/button";
import { Check, ShieldAlert } from "lucide-react";
import { useLocation } from "wouter";
import { walkData } from "@/lib/mockData";
import { motion } from "framer-motion";

export function WalkMode() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-[#0a0f1e]">
      <MapBackground active={true} />
      
      {/* Top Bar */}
      <div className="relative z-10 bg-background/90 backdrop-blur-md border-b border-border p-4 pt-12">
        <button onClick={() => setLocation("/home")} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2 mb-2 font-medium" data-testid="btn-back">
          ← Walking to {walkData.destination}
        </button>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white font-semibold">{walkData.eta} left</span>
          <span className="text-primary flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {walkData.activeGuardians} guardians watching
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-auto px-6 pb-20 flex flex-col items-center gap-8">
        <div className="flex gap-4 w-full">
          <Button variant="secondary" className="flex-1 rounded-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium" data-testid="btn-check-in">
            Check In
          </Button>
          <Button variant="outline" className="flex-1 rounded-full h-12 border-border bg-card hover:bg-accent text-foreground font-medium" onClick={() => setLocation("/safe")} data-testid="btn-safe">
            I'm Safe
          </Button>
        </div>

        <SOSButton />

        {/* Alert Feed */}
        <div className="w-full flex flex-col gap-2 mt-4">
          {walkData.alerts.map((alert, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`text-xs px-4 py-3 rounded-xl border ${alert.type === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'} flex items-center gap-2`}
            >
              {alert.text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
