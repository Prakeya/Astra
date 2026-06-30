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
    <div className="min-h-[100dvh] w-full flex flex-col bg-slate-50 text-[#083344] font-sans">
      {/* Header */}
      <div className="p-4 pt-12 sticky top-0 z-10 border-b border-[#085a70]/10 bg-white/95 backdrop-blur">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => step === 1 ? setLocation("/profile") : prevStep()}
            className="text-[#085a70] hover:text-[#083344] text-xs uppercase tracking-wider flex items-center gap-2 font-black" data-testid="btn-back">
            ← {step === 1 ? "Cancel" : "Back"}
          </button>
          <span className="text-[10px] font-black text-[#0d9488] uppercase tracking-widest">Step {step}/{TOTAL}</span>
        </div>
        <div className="flex gap-1.5">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-slate-200">
              <motion.div className="h-full rounded-full bg-[#0d9488]"
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
              <h1 className="text-2xl font-black text-[#083344] mb-1 uppercase tracking-wider">Verify Identity</h1>
              <p className="text-[#085a70]/80 text-xs mb-3 font-medium">Both documents are <strong className="text-[#0d9488]">compulsory</strong>. Your application cannot proceed without them.</p>

              <div className="rounded-2xl p-3 border border-amber-200 mb-5 flex gap-2 bg-amber-50">
                <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5"/>
                <p className="text-xs text-amber-900 font-medium">Astra verifies every guardian to ensure community safety. Documents are encrypted and never shared.</p>
              </div>

              {/* Gov ID */}
              <div className="mb-4">
                <input ref={govRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => handleFile(e, setGovId)} data-testid="input-gov-id"/>
                <button onClick={() => govRef.current?.click()}
                  className={`w-full rounded-2xl p-5 border-2 flex flex-col items-center justify-center text-center transition-all ${govId.uploaded ? "border-emerald-500 bg-emerald-50/50" : errors.govId ? "border-red-300 bg-red-50/30" : "border-dashed border-slate-200 bg-white"}`}
                  data-testid="btn-upload-gov-id">
                  {govId.uploaded
                    ? <><FileCheck size={24} className="text-emerald-600 mb-2"/><span className="font-bold text-emerald-800 text-xs uppercase tracking-wider">✓ {govId.name}</span><span className="text-[10px] text-emerald-600 mt-0.5 uppercase font-bold">ID uploaded</span></>
                    : <><Upload size={24} className="text-[#085a70]/60 mb-2"/><span className="font-black text-[#083344] text-xs uppercase tracking-wider">Government ID Proof *</span><span className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Tap to upload front & back</span></>}
                </button>
                {errors.govId && <ErrorMsg msg={errors.govId}/>}
              </div>

              {/* Address proof */}
              <div className="mb-4">
                <input ref={addrRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => handleFile(e, setAddressProof)} data-testid="input-address-proof"/>
                <button onClick={() => addrRef.current?.click()}
                  className={`w-full rounded-2xl p-5 border-2 flex flex-col items-center justify-center text-center transition-all ${addressProof.uploaded ? "border-emerald-500 bg-emerald-50/50" : errors.addressProof ? "border-red-300 bg-red-50/30" : "border-dashed border-slate-200 bg-white"}`}
                  data-testid="btn-upload-address">
                  {addressProof.uploaded
                    ? <><FileCheck size={24} className="text-emerald-600 mb-2"/><span className="font-bold text-emerald-800 text-xs uppercase tracking-wider">✓ {addressProof.name}</span><span className="text-[10px] text-emerald-600 mt-0.5 uppercase font-bold">Address proof uploaded</span></>
                    : <><Upload size={24} className="text-[#085a70]/60 mb-2"/><span className="font-black text-[#083344] text-xs uppercase tracking-wider">Address Proof *</span><span className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Utility bill or bank statement</span></>}
                </button>
                {errors.addressProof && <ErrorMsg msg={errors.addressProof}/>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Video */}
          {step === 2 && (
            <motion.div key="2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h1 className="text-2xl font-black text-[#083344] mb-1 uppercase tracking-wider">Video Introduction</h1>
              <p className="text-[#085a70]/80 text-xs mb-5 font-medium">A 30-second intro is <strong className="text-[#0d9488]">compulsory</strong>. It helps the community recognise and trust you.</p>

              <div className={`w-full rounded-3xl border-2 flex flex-col items-center justify-center py-12 mb-4 transition-all ${videoRecorded ? "border-emerald-500 bg-emerald-50/50" : errors.video ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-white"}`}
                style={{ minHeight: 240 }}>
                {videoRecorded ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <Check size={32} className="text-emerald-600"/>
                    </div>
                    <p className="text-emerald-800 font-bold uppercase tracking-wider text-xs">Video recorded ✓</p>
                    <button onClick={() => setVideoRecorded(false)} className="mt-2 text-xs font-bold text-rose-500 uppercase tracking-wider underline">Re-record</button>
                  </>
                ) : (
                  <>
                    <Video size={40} className="text-[#085a70]/60 mb-4"/>
                    <span className="font-black text-[#083344] mb-1 text-xs uppercase tracking-wider">Record Introduction *</span>
                    <span className="text-[10px] text-slate-400 px-8 text-center font-bold uppercase tracking-wider">State your name and why you want to be a guardian.</span>
                    <button onClick={() => setVideoRecorded(true)}
                      className="mt-6 w-16 h-16 rounded-full bg-[#0d9488] flex items-center justify-center border-4 border-slate-100 shadow-lg"
                      data-testid="btn-record">
                      <div className="w-5 h-5 bg-white rounded-sm"/>
                    </button>
                    <span className="text-[10px] text-[#085a70]/60 mt-3 font-bold uppercase tracking-wider">Tap to start recording</span>
                  </>
                )}
              </div>
              {errors.video && <ErrorMsg msg={errors.video}/>}
            </motion.div>
          )}

          {/* Step 3: Vouches */}
          {step === 3 && (
            <motion.div key="3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h1 className="text-2xl font-black text-[#083344] mb-1 uppercase tracking-wider">Community Vouches</h1>
              <p className="text-[#085a70]/80 text-xs mb-5 font-medium">At least <strong className="text-[#0d9488]">1 vouch</strong> from an existing guardian is <strong className="text-[#0d9488]">mandatory</strong>.</p>

              <div className="rounded-2xl border border-[#085a70]/10 p-4 flex items-center justify-between mb-3 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0d9488]/20 text-[#0d9488] flex items-center justify-center font-black text-xs uppercase">AF</div>
                  <div>
                    <div className="font-bold text-[#083344] text-xs uppercase tracking-wider">Ananya F.</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guardian since 2023 · ⭐ 4.9</div>
                  </div>
                </div>
                {vouched
                  ? <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-full"><Check size={16}/></div>
                  : <button onClick={() => { setVouched(true); setErrors(prev => ({ ...prev, vouch:"" })); }}
                      className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/30 hover:bg-[#0d9488]/20 transition-all"
                      data-testid="btn-request-vouch">
                      Request vouch
                    </button>}
              </div>

              {vouched && (
                <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                  className="rounded-2xl p-3 border border-emerald-200 mb-3 flex gap-2 bg-emerald-50">
                  <Check size={14} className="text-emerald-600 mt-0.5 shrink-0"/>
                  <p className="text-xs font-medium text-emerald-900">Ananya F. has vouched for you! You can now continue.</p>
                </motion.div>
              )}

              <Button variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2 border-[#085a70]/15 bg-white text-[#085a70]/70 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:bg-slate-50">
                <Users size={16}/> Request from another guardian
              </Button>
              {errors.vouch && <ErrorMsg msg={errors.vouch}/>}
            </motion.div>
          )}

          {/* Step 4: Probation */}
          {step === 4 && (
            <motion.div key="4" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h1 className="text-2xl font-black text-[#083344] mb-1 uppercase tracking-wider">Probation Period</h1>
              <p className="text-[#085a70]/80 text-xs mb-5 font-medium">Final step! You must complete a 30-day supervised period before becoming a full guardian.</p>

              <div className="rounded-2xl border border-[#085a70]/10 p-5 flex flex-col items-center text-center mb-4 relative overflow-hidden bg-white shadow-sm">
                <div className="absolute top-0 w-full h-1 bg-slate-100">
                  <div className="h-full bg-[#0d9488] w-[7%]"/>
                </div>
                <Clock className="text-[#0d9488] mb-4 mt-4" size={44}/>
                <h3 className="text-base font-black text-[#083344] mb-2 uppercase tracking-wider">30-Day Supervised Period</h3>
                <p className="text-xs text-[#085a70]/80 font-medium mb-5">Your first 3 responses will be reviewed by senior guardians. This ensures safety for everyone.</p>
                <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-widest px-2 border-t border-[#085a70]/5 pt-4">
                  <span className="text-slate-400">Responses: 0/3</span>
                  <span className="text-emerald-600">30 days left</span>
                </div>
              </div>

              <button onClick={() => { setAgreedProbation(a => !a); setErrors(prev => ({ ...prev, probation:"" })); }}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border transition-all text-left ${agreedProbation ? "border-[#0d9488] bg-[#0d9488]/10" : errors.probation ? "border-red-300 bg-red-50/30" : "border-slate-200 bg-white shadow-sm"}`}
                data-testid="btn-agree-probation">
                <div className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center shrink-0 ${agreedProbation ? "bg-[#0d9488] border-[#0d9488]" : "border-slate-300 bg-white"}`}>
                  {agreedProbation && <Check size={12} className="text-white"/>}
                </div>
                <span className="text-xs text-[#083344] font-medium leading-relaxed">I agree to the 30-day probation terms and understand my responses will be monitored. <strong className="text-[#0d9488] uppercase tracking-wider font-bold">This is compulsory.</strong></span>
              </button>
              {errors.probation && <ErrorMsg msg={errors.probation}/>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-10 pt-4"
           style={{ background: "linear-gradient(to top, #f8fafc 70%, transparent)" }}>
        <Button onClick={next}
          className="w-full h-14 rounded-full font-black text-xs uppercase tracking-widest text-white shadow-md bg-[#0d9488] hover:bg-[#0f766e] transition-colors"
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
