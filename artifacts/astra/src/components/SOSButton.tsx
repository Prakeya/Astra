import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { AlertCircle } from "lucide-react";

export function SOSButton({ holdTime = 2000, onTrigger }: { holdTime?: number, onTrigger?: () => void }) {
  const [isHolding, setIsHolding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const [, setLocation] = useLocation();

  const handleStart = () => {
    setIsHolding(true);
    setShowToast(false);
    setProgress(0);
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / holdTime) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timerRef.current as NodeJS.Timeout);
        if (onTrigger) onTrigger();
        else setLocation("/sos");
      }
    }, 50);
  };

  const handleEnd = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (progress > 0 && progress < 100) {
      // Was a tap or short hold
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
    
    setIsHolding(false);
    setProgress(0);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 bg-card text-card-foreground text-sm py-1.5 px-4 rounded-full shadow-lg border border-border"
          >
            Hold to trigger emergency
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        className="relative rounded-full w-32 h-32 flex items-center justify-center cursor-pointer select-none"
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        data-testid="button-sos"
      >
        <div className="absolute inset-0 rounded-full bg-destructive/20" />
        
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle 
            cx="64" cy="64" r="60" 
            fill="none" 
            stroke="hsl(var(--destructive))" 
            strokeWidth="8"
            strokeDasharray="377"
            strokeDashoffset={377 - (377 * progress) / 100}
            className="transition-all duration-75 ease-linear"
          />
        </svg>
        
        <motion.div 
          animate={{ scale: isHolding ? 0.95 : 1 }}
          className="w-24 h-24 rounded-full bg-destructive flex flex-col items-center justify-center text-white shadow-lg shadow-destructive/50 relative z-10"
        >
          <AlertCircle size={32} />
          <span className="font-bold font-display mt-1 tracking-wider">SOS</span>
        </motion.div>
      </div>
      <p className="text-muted-foreground text-xs mt-4 uppercase tracking-widest font-medium">Hold 2 seconds</p>
    </div>
  );
}
