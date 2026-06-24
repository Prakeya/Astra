import { MapBackground } from "@/components/MapBackground";
import { Button } from "@/components/ui/button";
import { guardians } from "@/lib/mockData";
import { Phone, PhoneCall, Volume2, Flashlight } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export function SOSScreen() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col bg-[#1a0505]">
      {/* Red tinted map */}
      <div className="absolute inset-0 opacity-50 mix-blend-color-burn bg-destructive z-0" />
      <MapBackground />
      
      {/* Top Banner */}
      <div className="relative z-10 bg-destructive/90 text-white p-6 pt-14 text-center border-b border-destructive">
        <h1 className="font-display font-bold text-2xl tracking-widest uppercase flex items-center justify-center gap-2 mb-4 animate-pulse">
          🚨 Emergency Active
        </h1>
        <p className="text-sm font-medium text-white/90">Alerting guardians...</p>
        <div className="w-full bg-black/30 h-1.5 rounded-full mt-3 overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full" 
            initial={{ width: "30%" }} 
            animate={{ width: "66%" }} 
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-xs mt-2 text-white/70 tracking-widest">2/3 RESPONDED</p>
      </div>

      <div className="relative z-10 p-6 flex-1 flex flex-col">
        {/* Guardian List */}
        <div className="flex flex-col gap-3 mt-4 flex-1">
          {guardians.map((g, i) => (
            <motion.div 
              key={g.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/90 backdrop-blur-md border border-border p-4 rounded-2xl flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-white text-sm">{g.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{g.distance} away</p>
              </div>
              <div className="text-right flex flex-col items-end">
                {g.status === "arriving" && <span className="text-xs font-medium text-secondary flex items-center gap-1">⏱ {g.eta}</span>}
                {g.status === "police" && <span className="text-xs font-medium text-blue-400">Called police</span>}
                {g.status === "online" && <span className="text-xs font-medium text-green-400">On line</span>}
                {g.phone && <button className="mt-2 bg-white/10 p-2 rounded-full text-white"><Phone size={14} /></button>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="mt-auto flex flex-col gap-4 pb-8">
          <div className="flex gap-4 mb-2">
            <button className="flex-1 bg-card border border-border rounded-xl py-3 flex flex-col items-center gap-1 text-white hover:bg-accent transition-colors">
              <Volume2 size={20} className="text-secondary" />
              <span className="text-[10px] uppercase tracking-wider font-bold">Alarm (On)</span>
            </button>
            <button className="flex-1 bg-card border border-border rounded-xl py-3 flex flex-col items-center gap-1 text-white hover:bg-accent transition-colors">
              <Flashlight size={20} className="text-primary" />
              <span className="text-[10px] uppercase tracking-wider font-bold">Flash (On)</span>
            </button>
          </div>
          
          <div className="flex gap-3">
            <Button className="flex-1 h-14 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold" data-testid="btn-call-closest">
              Call Closest
            </Button>
            <Button className="flex-1 h-14 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold" data-testid="btn-call-police">
              Call Police
            </Button>
          </div>
          <Button variant="outline" className="w-full h-14 rounded-full border-white/20 text-white font-medium hover:bg-white/10 hover:text-white" onClick={() => setLocation("/safe")} data-testid="btn-safe-now">
            Safe Now
          </Button>
        </div>
      </div>
    </div>
  );
}
