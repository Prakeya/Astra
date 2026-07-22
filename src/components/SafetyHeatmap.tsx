import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info, ShieldCheck } from "lucide-react";
import { LEVEL_COLOR, LEVEL_STROKE, type SafetyLevel } from "@/lib/safetyData";
import { getComplaints, computeHeatmapZones, type DynamicHeatmapZone, type Complaint } from "@/lib/safetyStore";

const LEVEL_ICON: Record<SafetyLevel, React.ReactNode> = {
  safe: <CheckCircle size={14} />,
  caution: <Info size={14} />,
  danger: <AlertTriangle size={14} />,
};

interface Props {
  onZoneSelect?: (zone: DynamicHeatmapZone | null) => void;
}

export function SafetyHeatmap({ onZoneSelect }: Props) {
  const [zones, setZones] = useState<DynamicHeatmapZone[]>([]);
  const [selected, setSelected] = useState<DynamicHeatmapZone | null>(null);

  const refreshZones = () => {
    const complaints = getComplaints();
    const computed = computeHeatmapZones(complaints);
    setZones(computed);
  };

  useEffect(() => {
    refreshZones();
    const handleUpdate = () => refreshZones();
    window.addEventListener("astra_complaints_updated", handleUpdate);
    return () => window.removeEventListener("astra_complaints_updated", handleUpdate);
  }, []);

  const pick = (z: DynamicHeatmapZone) => {
    const next = selected?.id === z.id ? null : z;
    setSelected(next);
    onZoneSelect?.(next);
  };

  if (zones.length === 0) {
    return (
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
        <ShieldCheck size={14} className="text-emerald-400 animate-pulse" />
        <span>No Reported Risk Hotspots • Clean Safety Perimeter</span>
      </div>
    );
  }

  return (
    <>
      {/* SVG Heatmap overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ zIndex: 3 }}
      >
        <defs>
          {zones.map((z) => (
            <radialGradient key={z.id} id={`grad-${z.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={LEVEL_COLOR[z.level]} stopOpacity={z.level === "danger" ? 0.45 : 0.25} />
              <stop offset="100%" stopColor={LEVEL_COLOR[z.level]} stopOpacity={0.02} />
            </radialGradient>
          ))}
        </defs>

        {zones.map((z, idx) => (
          <g key={z.id} style={{ pointerEvents: "all", cursor: "pointer" }} onClick={() => pick(z)}>
            {/* Pulse ring for danger zones */}
            {z.level === "danger" && (
              <motion.ellipse
                cx={z.cx}
                cy={z.cy}
                rx={z.rx + 4}
                ry={z.ry + 4}
                fill="none"
                stroke={LEVEL_STROKE[z.level]}
                strokeWidth="0.5"
                animate={{ opacity: [0.7, 0.1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.3 }}
              />
            )}

            {/* Fill blob */}
            <ellipse
              cx={z.cx}
              cy={z.cy}
              rx={z.rx}
              ry={z.ry}
              fill={`url(#grad-${z.id})`}
              stroke={selected?.id === z.id ? "white" : LEVEL_STROKE[z.level]}
              strokeWidth={selected?.id === z.id ? "0.8" : "0.4"}
              strokeDasharray={z.level === "caution" ? "1.5 1" : undefined}
              opacity={selected?.id === z.id ? 1 : 0.85}
            />

            {/* Centre dot */}
            <circle cx={z.cx} cy={z.cy} r="1.5" fill={LEVEL_COLOR[z.level]} opacity="0.95" />
          </g>
        ))}
      </svg>

      {/* Tap-to-dismiss backdrop */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[4]"
            onClick={() => {
              setSelected(null);
              onZoneSelect?.(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Zone detail card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute left-3 right-3 z-[5] rounded-2xl overflow-hidden border"
            style={{
              bottom: 188,
              background: "rgba(10,15,30,0.97)",
              borderColor: LEVEL_STROKE[selected.level],
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              className="px-4 pt-3 pb-2 flex items-center justify-between border-b"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: LEVEL_COLOR[selected.level] }}>{LEVEL_ICON[selected.level]}</span>
                <span className="font-bold text-white text-sm">{selected.label}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
                  style={{ background: `${LEVEL_COLOR[selected.level]}18`, color: LEVEL_COLOR[selected.level] }}
                >
                  {selected.level}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  onZoneSelect?.(null);
                }}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={14} className="text-slate-400" />
              </button>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-slate-200 mb-1.5">{selected.desc}</p>
              <p className="text-xs text-slate-400 leading-relaxed">💡 {selected.tip}</p>
              {selected.incidents > 0 && (
                <p className="text-[10px] text-slate-500 mt-2 border-t border-white/5 pt-2">
                  {selected.incidents} live complaint{selected.incidents > 1 ? "s" : ""} registered in this sector
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
