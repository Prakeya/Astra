import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function StarryBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate soft, subtle twinkling dream sparks in the upper sky
    const generatedSparkles: Sparkle[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 55, // Keep them in the upper half
      size: Math.random() * 2 + 0.8,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 3,
    }));
    setSparkles(generatedSparkles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Pristine Sky Gradient from user reference */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #7cd2eb 0%, #aae3cc 35%, #fef8d4 70%, #fbdcb4 100%)"
        }}
      />

      {/* Soft warm sun/moon orb on the upper right */}
      <motion.div
        className="absolute top-[16%] right-[12%] w-10 h-10 rounded-full shadow-[0_0_24px_rgba(253,186,116,0.35)]"
        style={{
          background: "radial-gradient(circle at 35% 35%, #fff2e6 0%, #fdbb91 100%)",
        }}
        animate={{
          y: [-4, 4, -4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Tiny shimmering sparkles (mimicking the delicate white specs in the reference) */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            width: sp.size,
            height: sp.size,
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.4)",
          }}
          animate={{
            opacity: [0.15, 0.85, 0.15],
            scale: [0.9, 1.25, 0.9],
          }}
          transition={{
            duration: sp.duration,
            repeat: Infinity,
            delay: sp.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Drifting warm-shaded fluffy vector clouds */}
      <motion.div
        className="absolute bottom-[10%] left-[-10%] w-[120%] h-[20%] opacity-85"
        animate={{ x: [-15, 15, -15] }}
        transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 1200 120" className="w-full h-full text-white/40 fill-current">
          <path d="M150 90 C 180 50, 220 50, 250 80 C 280 40, 340 45, 370 85 C 400 30, 480 30, 520 80 C 560 40, 620 40, 660 75 C 700 20, 780 20, 830 85 C 870 50, 920 50, 960 85 C 1000 30, 1080 30, 1120 90 L 1200 120 L 0 120 Z" />
        </svg>
      </motion.div>

      {/* Second closer layer of fluffy white/cream clouds */}
      <motion.div
        className="absolute bottom-[6%] left-[-5%] w-[110%] h-[18%] opacity-90"
        animate={{ x: [8, -8, 8] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 1200 120" className="w-full h-full text-white/60 fill-current">
          <path d="M80 90 C 120 45, 170 45, 210 85 C 240 35, 300 40, 340 80 C 380 20, 460 20, 500 75 C 540 35, 600 35, 640 70 C 680 15, 760 15, 810 80 C 850 45, 900 45, 940 80 C 980 25, 1060 25, 1100 90 L 1200 120 L 0 120 Z" />
        </svg>
      </motion.div>

      {/* Pristine stylized Vector Houses Skyline from reference image */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] sm:h-[110px] flex items-end justify-between px-2 overflow-hidden opacity-95">
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="w-full h-full text-white fill-current drop-shadow-[0_-4px_12px_rgba(253,224,71,0.1)]">
          {/* House 1: Cozy light blue house */}
          <rect x="20" y="55" width="60" height="65" fill="#a4e1e8" />
          <polygon points="15,55 50,20 85,55" fill="#4fa5b5" />
          <rect x="40" y="80" width="20" height="40" fill="#fffaf0" />
          <rect x="35" y="62" width="12" height="12" fill="#fef08a" />
          <rect x="53" y="62" width="12" height="12" fill="#fef08a" />

          {/* House 2: White modern steep gable house */}
          <rect x="110" y="45" width="75" height="75" fill="#f8fafc" />
          <polygon points="105,45 147,5 190,45" fill="#334155" />
          <rect x="135" y="80" width="25" height="40" fill="#cbd5e1" />
          <circle cx="147.5" cy="28" r="8" fill="#fef08a" />
          <rect x="122" y="55" width="14" height="18" fill="#e2e8f0" />
          <rect x="164" y="55" width="14" height="18" fill="#e2e8f0" />

          {/* House 3: Warm cozy wood/terracotta cottage */}
          <rect x="210" y="65" width="65" height="55" fill="#fed7aa" />
          <polygon points="205,65 242.5,35 280,65" fill="#dd6b20" />
          <rect x="230" y="85" width="25" height="35" fill="#fff" />
          <rect x="220" y="72" width="12" height="12" fill="#fef08a" />
          <rect x="253" y="72" width="12" height="12" fill="#fef08a" />

          {/* House 4: Minimal rustic tiny cabin */}
          <rect x="300" y="80" width="45" height="40" fill="#fcd34d" />
          <polygon points="295,80 322.5,60 350,80" fill="#b45309" />
          <rect x="315" y="95" width="15" height="25" fill="#fff" />

          {/* House 5: Elegant wide family home */}
          <rect x="370" y="50" width="90" height="70" fill="#ffedd5" />
          <polygon points="365,50 415,15 465,50" fill="#ca8a04" />
          <rect x="400" y="80" width="30" height="40" fill="#fdf6e2" />
          <rect x="382" y="60" width="15" height="15" fill="#fef08a" />
          <rect x="433" y="60" width="15" height="15" fill="#fef08a" />

          {/* House 6: Double story sage green villa */}
          <rect x="485" y="40" width="85" height="80" fill="#d9f99d" />
          <polygon points="480,40 527.5,10 575,40" fill="#4d7c0f" />
          <rect x="515" y="85" width="25" height="35" fill="#cbd5e1" />
          <rect x="500" y="50" width="15" height="20" fill="#fef08a" />
          <rect x="535" y="50" width="15" height="20" fill="#fef08a" />

          {/* House 7: Light sky-blue modern flat */}
          <rect x="590" y="55" width="80" height="65" fill="#bae6fd" />
          <polygon points="585,55 630,25 675,55" fill="#0369a1" />
          <rect x="620" y="85" width="20" height="35" fill="#fff" />
          <rect x="602" y="65" width="14" height="14" fill="#fef08a" />
          <rect x="644" y="65" width="14" height="14" fill="#fef08a" />

          {/* House 8: Tall beige townhouse */}
          <rect x="690" y="35" width="70" height="85" fill="#f5f5f4" />
          <polygon points="685,35 725,5 765,35" fill="#78716c" />
          <rect x="710" y="80" width="25" height="40" fill="#fffaf0" />
          <rect x="702" y="48" width="12" height="16" fill="#fef08a" />
          <rect x="736" y="48" width="12" height="16" fill="#fef08a" />

          {/* House 9: Warm coral cozy retreat */}
          <rect x="780" y="60" width="80" height="60" fill="#fecdd3" />
          <polygon points="775,60 820,25 865,60" fill="#be123c" />
          <rect x="810" y="85" width="20" height="35" fill="#fffaf0" />
          <rect x="792" y="68" width="14" height="12" fill="#fef08a" />
          <rect x="834" y="68" width="14" height="12" fill="#fef08a" />

          {/* House 10: White modern minimalist gable home */}
          <rect x="880" y="45" width="80" height="75" fill="#fafafa" />
          <polygon points="875,45 920,8 965,45" fill="#1e293b" />
          <rect x="910" y="80" width="20" height="40" fill="#e2e8f0" />
          <rect x="892" y="55" width="14" height="18" fill="#fef08a" />
          <rect x="934" y="55" width="14" height="18" fill="#fef08a" />
        </svg>
      </div>
    </div>
  );
}
