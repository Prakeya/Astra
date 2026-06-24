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
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-8" style={{ background: "#0a0f1e" }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="text-center"
        >
          <CheckCircle size={64} className="text-green-400 mx-auto mb-4"/>
          <h2 className="text-2xl font-bold text-white mb-2">Report Submitted</h2>
          <p className="text-slate-400 text-sm">Thank you. Your report helps keep the community safer.</p>
          <p className="text-slate-500 text-xs mt-2">Returning to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "#0a0f1e" }}>
      <div className="flex items-center gap-3 px-4 py-4 pt-12 border-b border-white/10">
        <button onClick={() => setLocation("/home")} className="p-2 rounded-full hover:bg-white/10" data-testid="btn-back">
          <ArrowLeft size={20} className="text-white"/>
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">Report Issue</h1>
          <p className="text-xs text-slate-400">Help keep your community safe</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col gap-5">
        {/* Location */}
        <div className="rounded-2xl p-4 border border-white/10 flex items-center gap-3" style={{ background: "#111827" }}>
          <MapPin size={18} className="text-primary shrink-0"/>
          <div>
            <div className="text-sm text-white font-medium">Current location detected</div>
            <div className="text-xs text-slate-400">Near Koramangala, Bangalore</div>
          </div>
          <button className="ml-auto text-xs text-primary">Change</button>
        </div>

        {/* Issue type */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">What happened?</h3>
          <div className="grid grid-cols-2 gap-2">
            {ISSUE_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                data-testid={`issue-type-${t.id}`}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${selectedType === t.id ? "border-primary bg-primary/10" : "border-white/10 bg-[#111827]"}`}
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs text-white font-medium leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Severity</h3>
          <div className="flex gap-2">
            {SEVERITY.map(s => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                data-testid={`severity-${s.toLowerCase()}`}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${severity === s ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-slate-400 bg-[#111827]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Description (optional)</h3>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you saw or experienced..."
            rows={3}
            data-testid="textarea-description"
            className="w-full rounded-xl p-3 text-sm text-white placeholder-slate-500 border border-white/10 resize-none outline-none focus:border-primary/50 transition-colors"
            style={{ background: "#111827" }}
          />
        </div>

        {/* Photo */}
        <button
          className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-white/20 text-slate-400 hover:border-primary/40 hover:text-primary transition-colors"
          data-testid="btn-add-photo"
        >
          <Camera size={20}/>
          <span className="text-sm">Add photo evidence (optional)</span>
        </button>

        {/* Anonymous toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10" style={{ background: "#111827" }}>
          <div>
            <div className="text-sm text-white font-medium">Report anonymously</div>
            <div className="text-xs text-slate-400">Your name won't be shown</div>
          </div>
          <button
            onClick={() => setAnonymous(!anonymous)}
            data-testid="toggle-anonymous"
            className={`w-12 h-6 rounded-full transition-colors relative ${anonymous ? "bg-primary" : "bg-white/20"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${anonymous ? "left-7" : "left-1"}`}/>
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedType}
          className="w-full h-12 rounded-full font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-40"
          data-testid="btn-submit-report"
        >
          Submit Report
        </Button>
      </div>
    </div>
  );
}
