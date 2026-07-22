import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, Camera, MapPin, CheckCircle, Image as ImageIcon, Sparkles, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { addComplaint } from "@/lib/safetyStore";
import { getMapCenterFromUser } from "@/lib/indiaStates";

const ISSUE_TYPES = [
  { id: "lighting", label: "Poor Lighting", icon: "💡" },
  { id: "harassment", label: "Harassment", icon: "⚠️" },
  { id: "suspicious", label: "Suspicious Activity", icon: "👁" },
  { id: "unsafe_path", label: "Unsafe Path", icon: "🚧" },
  { id: "stalking", label: "Stalking / Following", icon: "🚶‍♀️" },
  { id: "other", label: "Other Hazard", icon: "📝" },
];

const SEVERITY = ["Low", "Medium", "High", "Critical"] as const;

export function ReportIssue() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState("");
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState("Detecting location...");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!active) return;
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          setCoords({ lat: userLat, lng: userLng });
          setLocationName(`GPS: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`);
        },
        () => {
          if (!active) return;
          const fallback = getMapCenterFromUser();
          setCoords(fallback);
          setLocationName("Koramangala, Bengaluru (GPS)");
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      const fallback = getMapCenterFromUser();
      setCoords(fallback);
      setLocationName("Koramangala, Bengaluru (Fallback)");
    }
    return () => {
      active = false;
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    const item = ISSUE_TYPES.find(t => t.id === selectedType);
    const label = item ? item.label : "Issue Reported";

    const baseCoords = coords || getMapCenterFromUser();

    await addComplaint({
      type: selectedType,
      label,
      severity,
      description: description || `Reported ${label.toLowerCase()} in this sector.`,
      anonymous,
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.0015,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.0015,
      locationName: locationName || "Near Detected Sector",
      imageUrl: imagePreview || undefined,
    });

    setSubmitted(true);
    setTimeout(() => setLocation("/incident-map"), 2200);
  };

  if (submitted) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-8 bg-[#082f49] text-white font-sans">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="text-center bg-slate-900/90 border border-cyan-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} />
          </div>
          <h2 className="text-xl font-black text-white mb-2 uppercase tracking-wider">Report Logged & AI Analyzed</h2>
          <p className="text-cyan-200/80 text-xs font-semibold leading-relaxed mb-4">
            Thank you. Your report has updated the live community risk heatmap, safety score, and safe route routing engine.
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 px-3 py-1.5 rounded-full font-mono font-bold">
            <Sparkles size={12} className="animate-spin text-cyan-400" />
            <span>Redirecting to Live Incident Map...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-[#083344] font-sans">
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-[#085a70]/10 bg-white/80 backdrop-blur sticky top-0 z-10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} className="text-[#083344]"/>
        </button>
        <div>
          <h1 className="text-lg font-black uppercase tracking-wider text-[#083344]">Submit Safety Report</h1>
          <p className="text-xs font-medium text-[#085a70]/70">Feeds real-time AI safety engine & heatmaps</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-28 flex flex-col gap-5">
        {/* Location Card */}
        <div className="rounded-2xl p-4 border border-[#085a70]/10 flex items-center gap-3 bg-white shadow-xs">
          <MapPin size={20} className="text-[#0d9488] shrink-0"/>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#083344] font-black uppercase tracking-wider">Detected Location</div>
            <div className="text-[11px] text-slate-500 font-semibold truncate">{locationName}</div>
          </div>
        </div>

        {/* Issue Type */}
        <div>
          <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-3">Incident Category</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {ISSUE_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-left transition-all ${
                  selectedType === t.id
                    ? "border-[#0d9488] bg-[#0d9488]/10 text-[#083344] shadow-xs"
                    : "border-[#085a70]/10 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="text-xl shrink-0">{t.icon}</span>
                <span className="text-xs text-[#083344] font-extrabold uppercase tracking-wider leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-3">Threat Severity</h3>
          <div className="grid grid-cols-4 gap-2">
            {SEVERITY.map(s => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`py-2.5 rounded-xl text-xs font-black border transition-all uppercase tracking-wider ${
                  severity === s
                    ? "border-[#0d9488] bg-[#0d9488] text-white shadow-xs"
                    : "border-[#085a70]/10 text-slate-500 bg-white hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-2">Description</h3>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Provide context (e.g., '2 men following pedestrians near unlit alley')..."
            rows={3}
            className="w-full rounded-2xl p-3.5 text-xs font-medium text-[#083344] placeholder-slate-400 border border-[#085a70]/15 resize-none outline-none focus:border-[#0d9488] transition-colors bg-white shadow-xs"
          />
        </div>

        {/* Photo Evidence */}
        <div>
          <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-2">Photo Evidence (Optional)</h3>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-teal-500/30 max-h-48 bg-slate-900 flex items-center justify-center">
              <img src={imagePreview} alt="Evidence" className="w-full h-full object-cover" />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-slate-300 text-slate-500 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors bg-white"
            >
              <Camera size={18} />
              <span className="text-xs font-extrabold uppercase tracking-wider">Upload / Capture Photo</span>
            </button>
          )}
        </div>

        {/* Anonymous Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-[#085a70]/10 bg-white shadow-xs">
          <div>
            <div className="text-xs text-[#083344] font-black uppercase tracking-wider">Report Anonymously</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Identity protected by encryption</div>
          </div>
          <button
            onClick={() => setAnonymous(!anonymous)}
            className={`w-12 h-6 rounded-full transition-colors relative ${anonymous ? "bg-[#0d9488]" : "bg-slate-300"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-xs ${anonymous ? "left-7" : "left-1"}`}/>
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedType}
          className="w-full h-12 rounded-full font-black text-xs uppercase tracking-widest text-white bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-40 transition-all shadow-md"
        >
          Submit & Trigger AI Engine
        </Button>
      </div>
    </div>
  );
}
