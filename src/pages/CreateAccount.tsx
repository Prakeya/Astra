import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, AlertCircle, User, Globe, MapPin, Calendar, Camera, Check, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarryBackground } from "@/components/StarryBackground";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Chandigarh","Puducherry","Ladakh","Jammu & Kashmir"
];

const LANGUAGES = ["English","Hindi","Tamil","Telugu","Kannada","Malayalam","Bengali","Marathi","Gujarati","Punjabi","Odia","Urdu"];
const AGE_GROUPS = ["13–17","18–24","25–34","35–44","45–54","55+"];

interface FormData {
  name: string;
  age: string;
  state: string;
  language: string;
  phone: string;
  emergency: string;
  avatar: string | null;
  agreed: boolean;
}

interface FieldError {
  name?: string;
  age?: string;
  state?: string;
  language?: string;
  phone?: string;
  emergency?: string;
  agreed?: string;
}

const AVATARS = ["👩","👩‍🦰","👩‍🦱","👩‍🦳","👩‍🦲","🧕","👩‍🎓","🧑‍💼"];

export function CreateAccount() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ name:"", age:"", state:"", language:"English", phone:"", emergency:"", avatar:null, agreed:false });
  const [errors, setErrors] = useState<FieldError>({});
  const [showStateList, setShowStateList] = useState(false);
  const [showLangList, setShowLangList] = useState(false);
  const TOTAL = 3;

  const set = (k: keyof FormData, v: string | boolean | null) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validateStep1 = () => {
    const e: FieldError = {};
    if (!form.name.trim()) e.name = "Your name is required";
    if (!form.age) e.age = "Please select your age group";
    if (!form.state) e.state = "Your state is required — we use it to connect you with local guardians";
    if (!form.language) e.language = "Language preference is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: FieldError = {};
    if (!form.phone.trim() || form.phone.replace(/\D/g,"").length < 10) e.phone = "Valid phone number is required";
    if (!form.emergency.trim() || form.emergency.replace(/\D/g,"").length < 10) e.emergency = "Emergency contact number is required — this is mandatory for your safety";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: FieldError = {};
    if (!form.agreed) e.agreed = "You must agree to the safety terms to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveAccount = () => {
    try {
      localStorage.setItem("astra_user", JSON.stringify({
        name: form.name.trim(),
        age: form.age,
        state: form.state,
        language: form.language,
        phone: form.phone,
        emergency: form.emergency,
        avatar: form.avatar,
        initials: form.name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "U",
        createdAt: new Date().toISOString()
      }));
    } catch (e) {
      console.error("Failed to save account", e);
    }
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3) {
      if (!validateStep3()) return;
      saveAccount();
      setLocation("/home");
      return;
    }
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-[#e0f2fe] text-[#083344] font-sans">
      {/* Background stars */}
      <StarryBackground />

      {/* Header */}
      <div className="relative z-10 px-5 pt-14 pb-4 border-b border-[#085a70]/10 bg-white/45 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => step === 1 ? setLocation("/") : setStep(s => s-1)} className="p-2.5 rounded-2xl bg-white/70 border border-[#085a70]/10 shadow-sm hover:bg-white text-[#083344] transition-colors">
            <ArrowLeft size={14} className="stroke-[3]" />
          </button>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#085a70]/80">Step {step} of {TOTAL}</span>
        </div>
        <div className="flex gap-1.5">
          {[1,2,3].map(i => (
            <div key={i} className="h-1.5 flex-1 rounded-full overflow-hidden bg-[#085a70]/10">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(135deg, #0d9488, #085a70)" }}
                animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }}/>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#085a70] font-black uppercase tracking-widest mt-3">
          {step === 1 ? "Tell us about yourself" : step === 2 ? "Set up your emergency contacts" : "Review & confirm"}
        </p>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6 pb-32">
        <AnimatePresence mode="wait">

          {/* Step 1: Profile */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} className="flex flex-col gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-1 shadow-md">
                <User size={28} className="text-white"/>
              </div>
              <div>
                <h1 className="text-xl font-black text-[#083344] uppercase tracking-wide">Create your profile</h1>
                <p className="text-xs text-[#0f766e] mt-1 font-semibold">This helps us personalise Astra for you.</p>
              </div>

              {/* Avatar picker */}
              <div>
                <p className="text-[10px] font-black text-[#085a70]/80 mb-2 uppercase tracking-widest">Choose your avatar</p>
                <div className="flex gap-2 flex-wrap">
                  {AVATARS.map(a => (
                    <button key={a} onClick={() => set("avatar", a)}
                      className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center border-2 transition-all ${form.avatar === a ? "border-[#0d9488] bg-white shadow-md" : "border-[#085a70]/10 bg-white/55 text-slate-200 hover:bg-white"}`}>
                      {a}
                    </button>
                  ))}
                  <button onClick={() => set("avatar","📷")}
                    className="w-12 h-12 rounded-2xl border-2 border-dashed border-[#085a70]/20 flex items-center justify-center text-[#085a70]/50 hover:bg-white bg-white/45">
                    <Camera size={18}/>
                  </button>
                </div>
              </div>

              {/* Name */}
              <Field label="Your name *" error={errors.name}>
                <input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-2xl px-4 py-3.5 text-xs font-bold text-[#083344] outline-none border border-[#085a70]/15 transition-all bg-white/75 placeholder:text-[#083344]/40 focus:border-[#0d9488] focus:bg-white shadow-sm"/>
              </Field>

              {/* Age group */}
              <Field label="Age group *" error={errors.age}>
                <div className="flex gap-2 flex-wrap">
                  {AGE_GROUPS.map(a => (
                    <button key={a} onClick={() => set("age", a)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-black border transition-all uppercase tracking-wider ${form.age === a ? "border-[#0d9488] bg-[#0d9488]/10 text-[#0d9488] font-black shadow-sm" : "border-[#085a70]/15 text-[#083344]/60 bg-white/75 hover:bg-white"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </Field>

              {/* State */}
              <Field label="Your state *" error={errors.state} hint="Used to connect you with guardians nearby and provide local safety data">
                <button onClick={() => setShowStateList(!showStateList)}
                  className="w-full rounded-2xl px-4 py-3.5 text-xs font-bold outline-none border border-[#085a70]/15 transition-all bg-white/75 flex items-center justify-between text-left shadow-sm">
                  <span className={form.state ? "text-[#083344]" : "text-[#083344]/40"}>{form.state || "Select your state"}</span>
                  <ChevronDown size={14} className="text-[#085a70]" style={{ transform: showStateList ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
                </button>
                <AnimatePresence>
                  {showStateList && (
                    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="mt-1.5 rounded-2xl border border-[#085a70]/10 overflow-auto max-h-40 bg-white shadow-lg z-20 relative">
                      {STATES.map(s => (
                        <button key={s} onClick={() => { set("state", s); setShowStateList(false); }}
                          className="w-full text-left px-4 py-3 text-xs font-bold text-[#083344] hover:bg-[#085a70]/5 flex items-center justify-between">
                          {s}
                          {form.state === s && <Check size={14} className="text-[#0d9488] stroke-[3]"/>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Field>

              {/* Language */}
              <Field label="Language preference *" error={errors.language}>
                <button onClick={() => setShowLangList(!showLangList)}
                  className="w-full rounded-2xl px-4 py-3.5 text-xs font-bold outline-none border border-[#085a70]/15 transition-all bg-white/75 flex items-center justify-between text-left shadow-sm">
                  <span className="text-[#083344]">{form.language}</span>
                  <ChevronDown size={14} className="text-[#085a70]"/>
                </button>
                <AnimatePresence>
                  {showLangList && (
                    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="mt-1.5 rounded-2xl border border-[#085a70]/10 overflow-auto max-h-40 bg-white shadow-lg z-20 relative">
                      {LANGUAGES.map(l => (
                        <button key={l} onClick={() => { set("language", l); setShowLangList(false); }}
                          className="w-full text-left px-4 py-3 text-xs font-bold text-[#083344] hover:bg-[#085a70]/5 flex items-center justify-between">
                          {l}
                          {form.language === l && <Check size={14} className="text-[#0d9488] stroke-[3]"/>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Field>
            </motion.div>
          )}

          {/* Step 2: Contact */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} className="flex flex-col gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-1 shadow-md">
                <Globe size={28} className="text-white"/>
              </div>
              <div>
                <h1 className="text-xl font-black text-[#083344] uppercase tracking-wide">Emergency contacts</h1>
                <p className="text-xs text-[#0f766e] mt-1 font-semibold">We'll reach out to these people if you need help.</p>
              </div>

              <div className="rounded-3xl p-4 border border-[#d97706]/20 flex gap-3 bg-[#d97706]/10 backdrop-blur-sm">
                <AlertCircle size={15} className="text-[#d97706] shrink-0 mt-0.5"/>
                <p className="text-[10px] text-[#b45309] leading-relaxed font-bold">Both your phone number and emergency contact are <strong>mandatory</strong>. Your SOS alerts will not work without them.</p>
              </div>

              <Field label="Your phone number *" error={errors.phone}>
                <div className="flex gap-2">
                  <div className="w-20 rounded-2xl px-4 py-3.5 text-xs font-black border border-[#085a70]/15 bg-white/55 text-[#083344] flex items-center justify-center shrink-0 shadow-sm">+91</div>
                  <input value={form.phone} onChange={e => set("phone", e.target.value.replace(/\D/g,""))}
                    placeholder="98765 00000" maxLength={10} type="tel"
                    className="flex-1 rounded-2xl px-4 py-3.5 text-xs font-bold text-[#083344] outline-none border border-[#085a70]/15 transition-all bg-white/75 placeholder:text-[#083344]/40 focus:border-[#0d9488] focus:bg-white shadow-sm"/>
                </div>
              </Field>

              <Field label="Emergency contact number *" error={errors.emergency} hint="This person will receive SOS alerts — must be someone who can help you quickly">
                <div className="flex gap-2">
                  <div className="w-20 rounded-2xl px-4 py-3.5 text-xs font-black border border-[#085a70]/15 bg-white/55 text-[#083344] flex items-center justify-center shrink-0 shadow-sm">+91</div>
                  <input value={form.emergency} onChange={e => set("emergency", e.target.value.replace(/\D/g,""))}
                    placeholder="Parent / Guardian" maxLength={10} type="tel"
                    className="flex-1 rounded-2xl px-4 py-3.5 text-xs font-bold text-[#083344] outline-none border border-[#085a70]/15 transition-all bg-white/75 placeholder:text-[#083344]/40 focus:border-[#0d9488] focus:bg-white shadow-sm"/>
                </div>
              </Field>

              <div className="rounded-3xl p-4 border border-[#085a70]/10 bg-white/55 backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-[#0d9488]"/>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#083344]">Location based on: {form.state || "your state"}</span>
                </div>
                <p className="text-[10px] text-[#0f766e] font-semibold leading-relaxed">Guardians near you in <strong className="text-[#083344]">{form.state || "your state"}</strong> will be automatically matched when you start a walk.</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Terms & Confirm */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} className="flex flex-col gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-1 shadow-md">
                <Shield size={28} className="text-white"/>
              </div>
              <div>
                <h1 className="text-xl font-black text-[#083344] uppercase tracking-wide">Almost there ✨</h1>
                <p className="text-xs text-[#0f766e] mt-1 font-semibold">Review your details and agree to our terms.</p>
              </div>

              {/* Summary card */}
              <div className="rounded-3xl border border-[#085a70]/10 divide-y divide-[#085a70]/5 mb-1 bg-white/55 backdrop-blur-sm shadow-sm overflow-hidden">
                {[
                  { icon: <User size={14}/>, label:"Name", val: form.name || "—" },
                  { icon: <Calendar size={14}/>, label:"Age group", val: form.age || "—" },
                  { icon: <MapPin size={14}/>, label:"State", val: form.state || "—" },
                  { icon: <Globe size={14}/>, label:"Language", val: form.language },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between gap-3 px-4 py-3 text-[#083344]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#085a70]/70">{r.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#085a70]">{r.label}</span>
                    </div>
                    <span className="text-xs font-black text-[#083344]">{r.val}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl p-4.5 border border-[#085a70]/10 bg-white/55 backdrop-blur-sm shadow-sm">
                <h4 className="text-[10px] font-black text-[#085a70] mb-3 uppercase tracking-widest">Safety Terms</h4>
                <ul className="text-[10px] text-[#0f766e] space-y-2.5 leading-relaxed font-semibold">
                  <li className="flex items-start gap-2">
                    <Check size={12} className="text-[#0d9488] mt-0.5 shrink-0 stroke-[3]"/>
                    <span>Astra will access your location during active walks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={12} className="text-[#0d9488] mt-0.5 shrink-0 stroke-[3]"/>
                    <span>Your emergency contact will receive alerts if you don't check in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={12} className="text-[#0d9488] mt-0.5 shrink-0 stroke-[3]"/>
                    <span>Community reports you submit are anonymised</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={12} className="text-[#0d9488] mt-0.5 shrink-0 stroke-[3]"/>
                    <span>Voice activation (if enabled) processes audio on-device only</span>
                  </li>
                </ul>
              </div>

              <button onClick={() => set("agreed", !form.agreed)}
                className={`w-full flex items-start gap-3 p-4 rounded-3xl border transition-all text-left shadow-sm ${form.agreed ? "border-[#0d9488] bg-[#0d9488]/10 text-[#083344]" : "border-[#085a70]/10 bg-white/55 hover:bg-white"}`}>
                <div className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all ${form.agreed ? "bg-[#0d9488] border-[#0d9488]" : "border-[#085a70]/30 bg-white"}`}>
                  {form.agreed && <Check size={12} className="text-white stroke-[3]"/>}
                </div>
                <span className="text-[10px] font-bold text-[#0f766e] leading-relaxed">I agree to Astra's safety terms and allow emergency contacts to be notified in an SOS situation. <strong className="text-rose-600 uppercase tracking-wide block mt-0.5 font-black">This is compulsory.</strong></span>
              </button>
              {errors.agreed && <ErrorMsg msg={errors.agreed}/>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="relative z-10 px-5 pb-10 pt-4 bg-transparent">
        <Button onClick={next}
          className="w-full h-14 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg flex items-center justify-center gap-1 border border-teal-500/10 active:scale-[0.98] transition-transform"
          style={{ 
            background: "linear-gradient(135deg, #0d9488, #085a70)",
            boxShadow: "0 10px 20px -8px rgba(8,90,112,0.35)"
          }}
          data-testid="btn-next">
          {step < TOTAL ? (
            <div className="flex items-center gap-1">Continue <ArrowRight size={13} className="stroke-[3]" /></div>
          ) : "Start using Astra ✨"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="block text-[10px] font-black text-[#085a70] uppercase tracking-widest">{label}</label>
      {hint && <p className="text-[10px] text-[#0f766e] leading-relaxed font-semibold">{hint}</p>}
      {children}
      {error && <ErrorMsg msg={error}/>}
    </div>
  );
}
function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-1.5 mt-1">
      <AlertCircle size={13} className="text-rose-600 mt-0.5 shrink-0"/>
      <p className="text-[10px] text-rose-600 font-bold">{msg}</p>
    </div>
  );
}
