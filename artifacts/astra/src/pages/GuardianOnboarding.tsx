import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Upload, Video, Users, Clock, AlertCircle, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocState { name: string | null; uploaded: boolean }

export function GuardianOnboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [govId, setGovId] = useState<DocState>({ name: null, uploaded: false });
  const [addressProof, setAddressProof] = useState<DocState>({ name: null, uploaded: false });
  const [videoRecorded, setVideoRecorded] = useState(false);
  const [vouched, setVouched] = useState(false);
  const [agreedProbation, setAgreedProbation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const govRef = useRef<HTMLInputElement>(null);
  const addrRef = useRef<HTMLInputElement>(null);
  const TOTAL = 4;

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (d: DocState) => void
  ) => {
    const f = e.target.files?.[0];
    if (f) { setter({ name: f.name, uploaded: true }); setErrors(prev => ({ ...prev, docs: "" })); }
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!govId.uploaded) e.govId = "Government ID is compulsory — your application cannot proceed without it";
      if (!addressProof.uploaded) e.addressProof = "Address proof is compulsory — we need it to verify your location";
    }
    if (step === 2) {
      if (!videoRecorded) e.video = "A video introduction is compulsory — it helps the community trust you";
    }
    if (step === 3) {
      if (!vouched) e.vouch = "You need at least 1 guardian vouch to continue. This is mandatory.";
    }
    if (step === 4) {
      if (!agreedProbation) e.probation = "You must agree to the probation terms to submit your application";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < TOTAL) { setStep(s => s + 1); }
    else { setLocation("/profile"); }
  };

  const prevStep = () => { setStep(s => Math.max(s - 1, 1)); setErrors({}); };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col" style={{ background: "#09111f" }}>
      {/* Header */}
      <div className="p-4 pt-12 sticky top-0 z-10 border-b border-white/10" style={{ background: "rgba(9,17,31,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => step === 1 ? setLocation("/profile") : prevStep()}
            className="text-slate-400 hover:text-white text-sm flex items-center gap-2 font-medium" data-testid="btn-back">
            ← {step === 1 ? "Cancel" : "Back"}
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Step {step}/{TOTAL}</span>
        </div>
        <div className="flex gap-1.5">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "#1e293b" }}>
              <motion.div className="h-full rounded-full bg-primary"
                animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }}/>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-5 pb-32">
        <AnimatePresence mode="wait">

          {/* Step 1: Documents */}
          {step === 1 && (
            <motion.div key="1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h1 className="text-2xl font-bold text-white mb-1">Verify Identity</h1>
              <p className="text-slate-400 text-sm mb-2">Both documents are <strong className="text-primary">compulsory</strong>. Your application cannot proceed without them.</p>

              <div className="rounded-2xl p-3 border border-amber-500/20 mb-5 flex gap-2" style={{ background:"rgba(120,80,0,0.12)" }}>
                <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5"/>
                <p className="text-xs text-amber-200">Astra verifies every guardian to ensure community safety. Documents are encrypted and never shared.</p>
              </div>

              {/* Gov ID */}
              <div className="mb-4">
                <input ref={govRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => handleFile(e, setGovId)} data-testid="input-gov-id"/>
                <button onClick={() => govRef.current?.click()}
                  className={`w-full rounded-2xl p-5 border-2 flex flex-col items-center justify-center text-center transition-all ${govId.uploaded ? "border-green-500/50 bg-green-500/8" : errors.govId ? "border-red-500/50 bg-red-500/5" : "border-dashed border-white/20 bg-white/3"}`}
                  data-testid="btn-upload-gov-id">
                  {govId.uploaded
                    ? <><FileCheck size={24} className="text-green-400 mb-2"/><span className="font-medium text-green-300 text-sm">✓ {govId.name}</span><span className="text-xs text-green-500 mt-0.5">ID uploaded</span></>
                    : <><Upload size={24} className="text-slate-400 mb-2"/><span className="font-medium text-white text-sm">Government ID Proof *</span><span className="text-xs text-slate-500 mt-0.5">Tap to upload front & back</span></>}
                </button>
                {errors.govId && <ErrorMsg msg={errors.govId}/>}
              </div>

              {/* Address proof */}
              <div className="mb-4">
                <input ref={addrRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => handleFile(e, setAddressProof)} data-testid="input-address-proof"/>
                <button onClick={() => addrRef.current?.click()}
                  className={`w-full rounded-2xl p-5 border-2 flex flex-col items-center justify-center text-center transition-all ${addressProof.uploaded ? "border-green-500/50 bg-green-500/8" : errors.addressProof ? "border-red-500/50 bg-red-500/5" : "border-dashed border-white/20 bg-white/3"}`}
                  data-testid="btn-upload-address">
                  {addressProof.uploaded
                    ? <><FileCheck size={24} className="text-green-400 mb-2"/><span className="font-medium text-green-300 text-sm">✓ {addressProof.name}</span><span className="text-xs text-green-500 mt-0.5">Address proof uploaded</span></>
                    : <><Upload size={24} className="text-slate-400 mb-2"/><span className="font-medium text-white text-sm">Address Proof *</span><span className="text-xs text-slate-500 mt-0.5">Utility bill or bank statement</span></>}
                </button>
                {errors.addressProof && <ErrorMsg msg={errors.addressProof}/>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Video */}
          {step === 2 && (
            <motion.div key="2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h1 className="text-2xl font-bold text-white mb-1">Video Introduction</h1>
              <p className="text-slate-400 text-sm mb-5">A 30-second intro is <strong className="text-primary">compulsory</strong>. It helps the community recognise and trust you.</p>

              <div className={`w-full rounded-3xl border-2 flex flex-col items-center justify-center py-12 mb-4 transition-all ${videoRecorded ? "border-green-500/50 bg-green-500/5" : errors.video ? "border-red-500/50" : "border-white/15 bg-white/3"}`}
                style={{ minHeight: 240 }}>
                {videoRecorded ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <Check size={32} className="text-green-400"/>
                    </div>
                    <p className="text-green-300 font-semibold">Video recorded ✓</p>
                    <button onClick={() => setVideoRecorded(false)} className="mt-2 text-xs text-slate-500 underline">Re-record</button>
                  </>
                ) : (
                  <>
                    <Video size={40} className="text-slate-400 mb-4"/>
                    <span className="font-medium text-white mb-1 text-sm">Record Introduction *</span>
                    <span className="text-xs text-slate-500 px-8 text-center">State your name and why you want to be a guardian.</span>
                    <button onClick={() => setVideoRecorded(true)}
                      className="mt-6 w-16 h-16 rounded-full bg-primary flex items-center justify-center border-4 border-white/20 shadow-lg"
                      data-testid="btn-record">
                      <div className="w-5 h-5 bg-white rounded-sm"/>
                    </button>
                    <span className="text-xs text-slate-500 mt-3">Tap to start recording</span>
                  </>
                )}
              </div>
              {errors.video && <ErrorMsg msg={errors.video}/>}
            </motion.div>
          )}

          {/* Step 3: Vouches */}
          {step === 3 && (
            <motion.div key="3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h1 className="text-2xl font-bold text-white mb-1">Community Vouches</h1>
              <p className="text-slate-400 text-sm mb-5">At least <strong className="text-primary">1 vouch</strong> from an existing guardian is <strong className="text-primary">mandatory</strong>.</p>

              <div className="rounded-2xl border border-white/10 p-4 flex items-center justify-between mb-3" style={{ background:"#111827" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">AF</div>
                  <div>
                    <div className="font-medium text-white text-sm">Ananya F.</div>
                    <div className="text-xs text-slate-400">Guardian since 2023 · ⭐ 4.9</div>
                  </div>
                </div>
                {vouched
                  ? <div className="bg-green-500/20 text-green-400 p-1.5 rounded-full"><Check size={16}/></div>
                  : <button onClick={() => { setVouched(true); setErrors(prev => ({ ...prev, vouch:"" })); }}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/30"
                      data-testid="btn-request-vouch">
                      Request vouch
                    </button>}
              </div>

              {vouched && (
                <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                  className="rounded-2xl p-3 border border-green-500/20 mb-3 flex gap-2" style={{ background:"rgba(21,128,61,0.1)" }}>
                  <Check size={14} className="text-green-400 mt-0.5 shrink-0"/>
                  <p className="text-xs text-green-300">Ananya F. has vouched for you! You can now continue.</p>
                </motion.div>
              )}

              <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 border-white/15 bg-transparent hover:bg-white/5 text-slate-400 font-medium flex items-center justify-center gap-2">
                <Users size={18}/> Request from another guardian
              </Button>
              {errors.vouch && <ErrorMsg msg={errors.vouch}/>}
            </motion.div>
          )}

          {/* Step 4: Probation */}
          {step === 4 && (
            <motion.div key="4" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h1 className="text-2xl font-bold text-white mb-1">Probation Period</h1>
              <p className="text-slate-400 text-sm mb-5">Final step! You must complete a 30-day supervised period before becoming a full guardian.</p>

              <div className="rounded-2xl border border-white/10 p-5 flex flex-col items-center text-center mb-4 relative overflow-hidden" style={{ background:"#111827" }}>
                <div className="absolute top-0 w-full h-1 bg-white/10">
                  <div className="h-full bg-primary w-[7%]"/>
                </div>
                <Clock className="text-primary mb-4 mt-4" size={44}/>
                <h3 className="text-lg font-bold text-white mb-2">30-Day Supervised Period</h3>
                <p className="text-sm text-slate-400 mb-5">Your first 3 responses will be reviewed by senior guardians. This ensures safety for everyone.</p>
                <div className="flex justify-between w-full text-xs font-bold uppercase tracking-wider px-2 border-t border-white/10 pt-4">
                  <span className="text-slate-400">Responses: 0/3</span>
                  <span className="text-teal-400">30 days left</span>
                </div>
              </div>

              <button onClick={() => { setAgreedProbation(a => !a); setErrors(prev => ({ ...prev, probation:"" })); }}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border transition-all text-left ${agreedProbation ? "border-primary bg-primary/10" : errors.probation ? "border-red-500/40 bg-red-500/5" : "border-white/10 bg-white/5"}`}
                data-testid="btn-agree-probation">
                <div className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center shrink-0 ${agreedProbation ? "bg-primary border-primary" : "border-white/30"}`}>
                  {agreedProbation && <Check size={12} className="text-white"/>}
                </div>
                <span className="text-sm text-slate-200">I agree to the 30-day probation terms and understand my responses will be monitored. <strong className="text-primary">This is compulsory.</strong></span>
              </button>
              {errors.probation && <ErrorMsg msg={errors.probation}/>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-10 pt-4"
           style={{ background: "linear-gradient(to top, #09111f 70%, transparent)" }}>
        <Button onClick={next}
          className="w-full h-14 rounded-full font-bold text-white text-base shadow-lg shadow-primary/30"
          style={{ background: "linear-gradient(135deg, #e85d7a, #c23a5a)" }}
          data-testid={step < TOTAL ? "btn-next-step" : "btn-submit-application"}>
          {step < TOTAL ? "Continue →" : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-1.5 mt-2">
      <AlertCircle size={13} className="text-red-400 mt-0.5 shrink-0"/>
      <p className="text-xs text-red-400 leading-relaxed">{msg}</p>
    </div>
  );
}
