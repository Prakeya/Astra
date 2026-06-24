import { motion } from "framer-motion";

export function MapBackground({ active = false }: { active?: boolean }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0f1e]">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* SVG Roads */}
      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d="M-10,20 Q40,30 50,80 T110,90" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M20,-10 Q30,40 80,50 T90,110" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M0,60 Q50,70 100,40" fill="none" stroke="white" strokeWidth="0.2" />
        
        {active && (
          <motion.path 
            d="M-10,20 Q40,30 50,80 T110,90" 
            fill="none" 
            stroke="hsl(var(--primary))" 
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        )}
      </svg>

      {/* User Dot */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-secondary w-full h-full scale-150"
        />
        <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_15px_rgba(20,184,166,0.8)] relative z-10 border-2 border-[#0a0f1e]" />
      </div>

      {/* Guardian Dots */}
      <div className="absolute top-[30%] left-[60%]">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 rounded-full bg-primary" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(244,63,94,0.6)] relative z-10" />
      </div>
      <div className="absolute top-[70%] left-[30%]">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2.5, delay: 1 }} className="absolute inset-0 rounded-full bg-primary" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(244,63,94,0.6)] relative z-10" />
      </div>
    </div>
  );
}
