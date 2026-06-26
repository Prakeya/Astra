import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, AlertCircle, User, Globe, MapPin, Calendar, Camera, Check, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "linear-gradient(180deg, #fef2f3 0%, #ffffff 40%, #f0fdf4 100%)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-4 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => step === 1 ? setLocation("/") : setStep(s => s-1)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} className="text-slate-600"/>
          </button>
          <span className="text-sm font-medium text-slate-400">Step {step} of {TOTAL}</span>
        </div>
        <div className="flex gap-1.5">
          {[1,2,3].map(i => (
            <div key={i} className="h-1.5 flex-1 rounded-full overflow-hidden bg-slate-100">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(135deg, #f43e5c, #e11d48)" }}
                animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }}/>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 font-medium">
          {step === 1 ? "Tell us about yourself" : step === 2 ? "Set up your emergency contacts" : "Review & confirm"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">
        <AnimatePresence mode="wait">

          {/* Step 1: Profile */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-5 shadow-lg shadow-rose-200">
                <User size={28} className="text-white"/>
              </div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Create your profile</h1>
                <p className="text-sm text-slate-500">This helps us personalise Astra for you.</p>
              </div>

              {/* Avatar picker */}
              <div className="mb-5">
                <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Choose your avatar</p>
                <div className="flex gap-2 flex-wrap">
                  {AVATARS.map(a => (
                    <button key={a} onClick={() => set("avatar", a)}
                      className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center border-2 transition-all ${form.avatar === a ? "border-rose-400 bg-rose-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                      {a}
                    </button>
                  ))}
                  <button onClick={() => set("avatar","📷")}
                    className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                    <Camera size={18}/>
                  </button>
                </div>
              </div>

              {/* Name */}
              <Field label="Your name *" error={errors.name}>
                <input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 outline-none border border-slate-200 transition-colors bg-white placeholder:text-slate-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"/>
              </Field>

              {/* Age group */}
              <Field label="Age group *" error={errors.age}>
                <div className="flex gap-2 flex-wrap">
                  {AGE_GROUPS.map(a => (
                    <button key={a} onClick={() => set("age", a)}
                      className={`px-4 py-2 rounded-xl text-sm border transition-all ${form.age === a ? "border-rose-400 bg-rose-50 text-rose-600 font-semibold shadow-sm" : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </Field>

              {/* State */}
              <Field label="Your state *" error={errors.state} hint="Used to connect you with guardians nearby and provide local safety data">
                <button onClick={() => setShowStateList(!showStateList)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border border-slate-200 transition-colors bg-white flex items-center justify-between">
                  <span className={form.state ? "text-slate-800" : "text-slate-400"}>{form.state || "Select your state"}</span>
                  <ChevronDown size={16} className="text-slate-400" style={{ transform: showStateList ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
                </button>
                <AnimatePresence>
                  {showStateList && (
                    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="mt-1 rounded-xl border border-slate-200 overflow-auto max-h-40 bg-white shadow-sm">
                      {STATES.map(s => (
                        <button key={s} onClick={() => { set("state", s); setShowStateList(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-between">
                          {s}
                          {form.state === s && <Check size={14} className="text-rose-500"/>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Field>

              {/* Language */}
              <Field label="Language preference *" error={errors.language}>
                <button onClick={() => setShowLangList(!showLangList)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none border border-slate-200 transition-colors bg-white flex items-center justify-between">
                  <span className="text-slate-800">{form.language}</span>
                  <ChevronDown size={16} className="text-slate-400"/>
                </button>
                <AnimatePresence>
                  {showLangList && (
                    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className="mt-1 rounded-xl border border-slate-200 overflow-auto max-h-40 bg-white shadow-sm">
                      {LANGUAGES.map(l => (
                        <button key={l} onClick={() => { set("language", l); setShowLangList(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center justify-between">
                          {l}
                          {form.language === l && <Check size={14} className="text-rose-500"/>}
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
            <motion.div key="s2" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
                <Globe size={28} className="text-white"/>
              </div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Emergency contacts</h1>
                <p className="text-sm text-slate-500">We'll reach out to these people if you need help.</p>
              </div>

              <div className="rounded-2xl p-4 border border-amber-200 mb-5 flex gap-3 bg-amber-50">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                <p className="text-xs text-amber-700 leading-relaxed">Both your phone number and emergency contact are <strong>mandatory</strong>. Your SOS alerts will not work without them.</p>
              </div>

              <Field label="Your phone number *" error={errors.phone}>
                <div className="flex gap-2">
                  <div className="w-20 rounded-xl px-4 py-3 text-sm border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">+91</div>
                  <input value={form.phone} onChange={e => set("phone", e.target.value.replace(/\D/g,""))}
                    placeholder="98765 00000" maxLength={10} type="tel"
                    className="flex-1 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none border border-slate-200 transition-colors bg-white placeholder:text-slate-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"/>
                </div>
              </Field>

              <Field label="Emergency contact number *" error={errors.emergency} hint="This person will receive SOS alerts — must be someone who can help you quickly">
                <div className="flex gap-2">
                  <div className="w-20 rounded-xl px-4 py-3 text-sm border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">+91</div>
                  <input value={form.emergency} onChange={e => set("emergency", e.target.value.replace(/\D/g,""))}
                    placeholder="Parent / Guardian" maxLength={10} type="tel"
                    className="flex-1 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none border border-slate-200 transition-colors bg-white placeholder:text-slate-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"/>
                </div>
              </Field>

              <div className="rounded-2xl p-4 border border-slate-200 mt-2 bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-teal-500"/>
                  <span className="text-xs font-semibold text-slate-600">Location based on: {form.state || "your state"}</span>
                </div>
                <p className="text-xs text-slate-400">Guardians near you in <strong className="text-slate-500">{form.state || "your state"}</strong> will be automatically matched when you start a walk.</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Terms & Confirm */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mb-5 shadow-lg shadow-violet-200">
                <Shield size={28} className="text-white"/>
              </div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Almost there ✨</h1>
                <p className="text-sm text-slate-500">Review your details and agree to our terms.</p>
              </div>

              {/* Summary card */}
              <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 mb-5 bg-white shadow-sm">
                {[
                  { icon: <User size={14}/>, label:"Name", val: form.name || "—" },
                  { icon: <Calendar size={14}/>, label:"Age group", val: form.age || "—" },
                  { icon: <MapPin size={14}/>, label:"State", val: form.state || "—" },
                  { icon: <Globe size={14}/>, label:"Language", val: form.language },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-slate-400">{r.icon}</span>
                    <span className="text-xs text-slate-500 w-20">{r.label}</span>
                    <span className="text-sm text-slate-800 font-medium flex-1 text-right">{r.val}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-4 border border-slate-200 mb-4 bg-white shadow-sm">
                <h4 className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Safety Terms</h4>
                <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Check size={12} className="text-emerald-500 mt-0.5 shrink-0"/>
                    <span>Astra will access your location during active walks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={12} className="text-emerald-500 mt-0.5 shrink-0"/>
                    <span>Your emergency contact will receive alerts if you don't check in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={12} className="text-emerald-500 mt-0.5 shrink-0"/>
                    <span>Community reports you submit are anonymised</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={12} className="text-emerald-500 mt-0.5 shrink-0"/>
                    <span>Voice activation (if enabled) processes audio on-device only</span>
                  </li>
                </ul>
              </div>

              <button onClick={() => set("agreed", !form.agreed)}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border transition-all text-left ${form.agreed ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                <div className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all ${form.agreed ? "bg-rose-500 border-rose-500" : "border-slate-300"}`}>
                  {form.agreed && <Check size={12} className="text-white"/>}
                </div>
                <span className="text-sm text-slate-600">I agree to Astra's safety terms and allow emergency contacts to be notified in an SOS situation. <strong className="text-rose-500">This is compulsory.</strong></span>
              </button>
              {errors.agreed && <ErrorMsg msg={errors.agreed}/>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-10 pt-4"
           style={{ background: "linear-gradient(to top, #ffffff 70%, transparent)" }}>
        <Button onClick={next}
          className="w-full h-14 rounded-2xl text-base font-bold text-white shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all"
          style={{ background: "linear-gradient(135deg, #f43e5c, #e11d48)" }}
          data-testid="btn-next">
          {step < TOTAL ? (
            <div className="flex items-center gap-2">Continue <ArrowRight size={18} /></div>
          ) : "Start using Astra ✨"}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-1.5 leading-relaxed">{hint}</p>}
      {children}
      {error && <ErrorMsg msg={error}/>}
    </div>
  );
}
function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-1.5 mt-1.5">
      <AlertCircle size={13} className="text-red-500 mt-0.5 shrink-0"/>
      <p className="text-xs text-red-500">{msg}</p>
    </div>
  );
}