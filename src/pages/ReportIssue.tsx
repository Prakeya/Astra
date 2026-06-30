import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, AlertTriangle, Camera, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ISSUE_TYPES = [
  { id: "lighting", label: "Poor Lighting", icon: "💡" },
  { id: "harassment", label: "Harassment", icon: "⚠️" },
  { id: "suspicious", label: "Suspicious Activity", icon: "👁" },
  { id: "unsafe_path", label: "Unsafe Path", icon: "🚧" },
  { id: "no_signal", label: "No Phone Signal", icon: "📵" },
  { id: "other", label: "Other", icon: "📝" },
];

const SEVERITY = ["Low", "Medium", "High", "Critical"];

export function ReportIssue() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = () => {
    if (!selectedType) return;
    setSubmitted(true);
    setTimeout(() => setLocation("/home"), 2500);
  };

  if (submitted) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-8 bg-slate-50 text-[#083344] font-sans">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="text-center"
        >
          <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4"/>
          <h2 className="text-2xl font-black text-[#083344] mb-2 uppercase tracking-wider">Report Submitted</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Thank you. Your report helps keep the community safer.</p>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-4">Returning to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-[#083344] font-sans">
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-[#085a70]/10 bg-white/80 backdrop-blur">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-slate-100 transition-colors" data-testid="btn-back">
          <ArrowLeft size={20} className="text-[#083344]"/>
        </button>
        <div>
          <h1 className="text-lg font-black uppercase tracking-wider text-[#083344]">Report Issue</h1>
          <p className="text-xs font-medium text-[#085a70]/70">Help keep your community safe</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-5">
        {/* Location */}
        <div className="rounded-2xl p-4 border border-[#085a70]/10 flex items-center gap-3 bg-white shadow-sm">
          <MapPin size={18} className="text-[#0d9488] shrink-0"/>
          <div>
            <div className="text-xs text-[#083344] font-black uppercase tracking-wider">Current location detected</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Near Koramangala, Bangalore</div>
          </div>
          <button className="ml-auto text-xs font-black text-[#0d9488] uppercase tracking-wider">Change</button>
        </div>

        {/* Issue type */}
        <div>
          <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-3">What happened?</h3>
          <div className="grid grid-cols-2 gap-2">
            {ISSUE_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                data-testid={`issue-type-${t.id}`}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${selectedType === t.id ? "border-[#0d9488] bg-[#0d9488]/10" : "border-[#085a70]/10 bg-white hover:bg-slate-50"}`}
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs text-[#083344] font-bold leading-tight uppercase tracking-wider">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-3">Severity</h3>
          <div className="flex gap-2">
            {SEVERITY.map(s => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                data-testid={`severity-${s.toLowerCase()}`}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all uppercase tracking-wider ${severity === s ? "border-[#0d9488] bg-[#0d9488]/10 text-[#0d9488]" : "border-[#085a70]/10 text-slate-400 bg-white hover:bg-slate-50"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest mb-3">Description (optional)</h3>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you saw or experienced..."
            rows={3}
            data-testid="textarea-description"
            className="w-full rounded-xl p-3 text-xs font-medium text-[#083344] placeholder-slate-400 border border-[#085a70]/15 resize-none outline-none focus:border-[#0d9488]/50 transition-colors bg-white shadow-xs"
          />
        </div>

        {/* Photo */}
        <button
          className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-slate-300 text-slate-400 hover:border-[#0d9488]/40 hover:text-[#0d9488] transition-colors bg-white"
          data-testid="btn-add-photo"
        >
          <Camera size={20}/>
          <span className="text-xs font-black uppercase tracking-wider">Add photo evidence (optional)</span>
        </button>

        {/* Anonymous toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-[#085a70]/10 bg-white shadow-sm" style={{ background: undefined }}>
          <div>
            <div className="text-xs text-[#083344] font-black uppercase tracking-wider">Report anonymously</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your name won't be shown</div>
          </div>
          <button
            onClick={() => setAnonymous(!anonymous)}
            data-testid="toggle-anonymous"
            className={`w-12 h-6 rounded-full transition-colors relative ${anonymous ? "bg-[#0d9488]" : "bg-slate-200"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${anonymous ? "left-7" : "left-1"}`}/>
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedType}
          className="w-full h-12 rounded-full font-black text-xs uppercase tracking-widest text-white bg-[#0d9488] hover:bg-[#0f766e] disabled:opacity-40 transition-colors"
          data-testid="btn-submit-report"
        >
          Submit Report
        </Button>
      </div>
    </div>
  );
}
