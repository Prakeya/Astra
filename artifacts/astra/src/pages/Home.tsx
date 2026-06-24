import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { MapBackground } from "@/components/MapBackground";
import { SafetyHeatmap } from "@/components/SafetyHeatmap";
import { ZONES, LEVEL_COLOR } from "@/lib/safetyData";
import { useState, useEffect } from "react";
import { Navigation, RefreshCw, Layers } from "lucide-react";

const dangerCount = ZONES.filter(z => z.level === "danger").length;
const cautionCount = ZONES.filter(z => z.level === "caution").length;
const safeCount = ZONES.filter(z => z.level === "safe").length;

const ROTATING_TIPS = [
  "2 guardians active within 200m of you",
  "MG Road is the safest route right now",
  "Check-in timer recommended after 9 PM",
  "Station Road: avoid after dark tonight",
  "3 zones are fully safe near you",
];

export function Home() {
  const [, setLocation] = useLocation();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [tipIdx, setTipIdx] = useState(0);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % ROTATING_TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => {
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 1200);
  };

  const areaStatus =
    dangerCount === 0 ? "✓ Your area is mostly safe right now"
    : dangerCount <= 1 ? "⚠ Some caution zones nearby — check the map"
    : "⚠ Several alert zones — prefer safe routes";

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col" style={{ background: "#080f1c" }}>
      <MapBackground />

      {/* Heatmap overlay */}
      <AnimatePresence>
        {showHeatmap && (
          <motion.div key="heatmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0" style={{ zIndex: 2 }}>
            <SafetyHeatmap />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient scrim — bottom */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(8,15,28,0.4) 0%, transparent 32%, rgba(8,15,28,0.88) 60%, rgba(8,15,28,0.99) 100%)",
        zIndex: 6,
      }} />

      {/* ── TOP BAR ── */}
      <div className="relative flex items-start justify-between px-4 pt-12 pb-3" style={{ zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-bold text-2xl text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Astra
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-300 font-medium">2 guardians near you</span>
          </div>
        </motion.div>

        <div className="flex gap-2">
          <motion.button
            onClick={() => setShowHeatmap(h => !h)}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border font-medium text-xs transition-all"
            style={{
              background: showHeatmap ? "rgba(232,93,122,0.15)" : "rgba(15,25,45,0.85)",
              borderColor: showHeatmap ? "rgba(232,93,122,0.4)" : "rgba(255,255,255,0.12)",
              color: showHeatmap ? "#e85d7a" : "#94a3b8",
              backdropFilter: "blur(12px)",
            }}
          >
            <Layers size={13} />
            {showHeatmap ? "Hide" : "Heatmap"}
          </motion.button>

          <motion.button
            onClick={handleRefresh}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center border"
            style={{ background: "rgba(15,25,45,0.85)", borderColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}
          >
            <motion.div animate={refreshed ? { rotate: 360 } : {}} transition={{ duration: 0.6 }}>
              <RefreshCw size={14} className={refreshed ? "text-primary" : "text-slate-400"} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* ── LEGEND ── */}
      <AnimatePresence>
        {showHeatmap && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute left-4 right-4 flex gap-2 justify-center"
            style={{ top: 110, zIndex: 10 }}
          >
            {([
              { level: "safe", label: `${safeCount} Safe` },
              { level: "caution", label: `${cautionCount} Caution` },
              { level: "danger", label: `${dangerCount} Alert` },
            ] as const).map(({ level, label }) => (
              <div key={level} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
                style={{ background: `${LEVEL_COLOR[level]}12`, borderColor: `${LEVEL_COLOR[level]}35`, backdropFilter: "blur(8px)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: LEVEL_COLOR[level] }} />
                <span className="text-[10px] font-semibold" style={{ color: LEVEL_COLOR[level] }}>{label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ROTATING TIP ── */}
      <div className="absolute left-4 right-4 overflow-hidden" style={{ top: showHeatmap ? 152 : 112, zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tipIdx}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="px-4 py-2.5 rounded-2xl border text-xs font-medium text-slate-200 flex items-center gap-2"
            style={{ background: "rgba(10,15,30,0.75)", borderColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
            <span className="text-base shrink-0">💡</span>
            {ROTATING_TIPS[tipIdx]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── BOTTOM PANEL ── */}
      <div className="relative mt-auto px-4 pb-24 flex flex-col gap-3" style={{ zIndex: 10 }}>

        {/* Area safety summary */}
        <AnimatePresence>
          {showHeatmap && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
              className="rounded-2xl border overflow-hidden"
              style={{ background: "rgba(10,15,30,0.93)", borderColor: "rgba(255,255,255,0.09)", backdropFilter: "blur(16px)" }}>
              <div className="px-4 py-2.5 border-b flex items-center justify-between"
                   style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Area Safety Now</span>
                <span className="text-[10px] text-slate-500">Tap zones on map</span>
              </div>
              <div className="flex">
                {([
                  { level: "safe", count: safeCount, label: "Safe" },
                  { level: "caution", count: cautionCount, label: "Caution" },
                  { level: "danger", count: dangerCount, label: "Alert" },
                ] as const).map(({ level, count, label }) => (
                  <div key={level} className="flex-1 px-3 py-3 text-center border-r last:border-r-0"
                       style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <div className="text-xl font-bold" style={{ color: LEVEL_COLOR[level] }}>{count}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{label} zone{count !== 1 ? "s" : ""}</div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-3 pt-1">
                <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(safeCount / ZONES.length) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ background: LEVEL_COLOR.safe, height: "100%" }} />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(cautionCount / ZONES.length) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                    style={{ background: LEVEL_COLOR.caution, height: "100%" }} />
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(dangerCount / ZONES.length) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{ background: LEVEL_COLOR.danger, height: "100%", borderRadius: "0 9999px 9999px 0" }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 text-center">{areaStatus}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Walking CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link href="/walk" className="block w-full">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full h-16 rounded-2xl font-bold text-white text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-3"
              style={{ background: "linear-gradient(135deg, #e85d7a 0%, #c23a5a 100%)" }}
            >
              <Navigation size={22} />
              Start Walking
            </motion.button>
          </Link>
        </motion.div>

        {/* Last walk */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl px-4 py-3 border flex items-center justify-between"
          style={{ background: "rgba(10,15,30,0.85)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
          <div>
            <span className="text-sm text-white font-medium">Last walk: Home → College</span>
            <div className="text-xs text-slate-400 mt-0.5">12 min · 3 guardians · Safe ✓</div>
          </div>
          <button onClick={() => setLocation("/walk")}
            className="text-xs text-primary font-semibold border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
            Again
          </button>
        </motion.div>
      </div>
    </div>
  );
}
