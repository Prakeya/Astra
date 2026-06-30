import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { User, Shield, Phone, MapPin, Settings as SettingsIcon, Heart, ChevronRight, Bell, Clock, Users, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StarryBackground } from "@/components/StarryBackground";

interface UserData {
  name: string;
  initials: string;
  avatar: string | null;
}

const gradientColors = ["from-[#0d9488] to-[#085a70]", "from-[#e11d48] to-rose-600", "from-teal-500 to-emerald-600", "from-amber-500 to-orange-600", "from-blue-500 to-indigo-600"];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return gradientColors[Math.abs(hash) % gradientColors.length];
}

export function Profile() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserData>({ name: "User", initials: "U", avatar: null });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("astra_user");
      if (raw) {
        const data = JSON.parse(raw);
        setUser({
          name: data.name || "User",
          initials: data.initials || data.name?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "U",
          avatar: data.avatar || null
        });
      }
    } catch (e) {
      // fallback to defaults
    }
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-white flex flex-col relative overflow-hidden text-[#083344] font-sans">

      {/* Header */}
      <div className="relative z-10 px-5 pt-14 pb-6 bg-slate-50/50 border-b border-[#085a70]/10 backdrop-blur shadow-sm">
        <button onClick={() => setLocation("/home")} className="text-[#0f766e] hover:text-[#083344] text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors">
          ← Back to Home
        </button>
        <div className="flex items-center gap-5">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradient(user.name)} flex items-center justify-center text-3xl font-black text-white shadow-md`}>
            {user.avatar || user.initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-[#083344]">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-amber-500 font-black">
                <Star size={13} fill="currentColor" /> 4.8
              </span>
              <span className="text-[#085a70]/30">·</span>
              <span className="text-xs text-[#0f766e] font-bold">12 helps completed</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#0d9488]/10 text-[#0d9488] font-black uppercase tracking-wider flex items-center gap-1 border border-[#0d9488]/10">
                <Shield size={10} /> Active Guardian
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 font-black uppercase tracking-wider border border-violet-500/10">Score 92</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6 pb-28 space-y-6 bg-white">
        
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Shield size={18} />, label: "Safety Score", color: "from-violet-500 to-purple-600", href: "/dashboard" },
            { icon: <Users size={18} />, label: "Guardians", color: "from-teal-400 to-emerald-500", href: "/guardians" },
            { icon: <Clock size={18} />, label: "Timeline", color: "from-amber-400 to-orange-500", href: "/dashboard" },
          ].map((item) => (
            <button key={item.label} onClick={() => setLocation(item.href)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 border border-[#085a70]/10 shadow-sm hover:bg-slate-100/70 transition-all active:scale-[0.97]">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
                <span className="text-white">{item.icon}</span>
              </div>
              <span className="text-[10px] font-black text-[#083344]/80 uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Guardian Preference */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Shield size={12} className="text-white" />
            </div>
            <h2 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest">Guardian Preference</h2>
          </div>
          <div className="bg-slate-50 rounded-3xl border border-[#085a70]/10 shadow-sm p-5 text-[#083344]">
            <RadioGroup defaultValue="female" className="gap-3">
              {[
                { value: "community", label: "Community members only" },
                { value: "female", label: "Female guardians only" },
                { value: "verified", label: "Verified guardians" },
                { value: "police", label: "Police-verified only" },
              ].map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-colors">
                  <RadioGroupItem value={opt.value} id={opt.value} className="text-[#0d9488] border-[#085a70]/20" />
                  <Label htmlFor={opt.value} className="text-xs font-extrabold text-[#083344] uppercase tracking-wider cursor-pointer">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-4 pt-4 border-t border-[#085a70]/10 flex items-center space-x-3">
              <Checkbox id="c1" defaultChecked className="text-[#0d9488] border-[#085a70]/20" />
              <Label htmlFor="c1" className="text-xs text-[#0f766e] leading-tight cursor-pointer font-bold">If no match, expand searching to nearest available guardians</Label>
            </div>
          </div>
        </section>

        {/* Trusted Contacts */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Phone size={12} className="text-white" />
            </div>
            <h2 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest">Trusted Contacts</h2>
          </div>
          <div className="bg-slate-50 rounded-3xl border border-[#085a70]/10 shadow-sm divide-y divide-[#085a70]/5">
            {[
              { name: "Mom", relation: "Primary Emergency contact" },
              { name: "Sister", relation: "Backup Emergency contact" },
            ].map((c) => (
              <div key={c.name} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-slate-100 flex items-center justify-center text-xs font-black text-[#083344] border border-[#085a70]/10 shadow-sm">
                    {c.name[0]}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#083344] block uppercase tracking-wider">{c.name}</span>
                    <span className="text-[10px] text-[#0f766e] font-semibold">{c.relation}</span>
                  </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 transition-colors">Edit</button>
              </div>
            ))}
            <div className="p-4">
              <Button variant="ghost" className="w-full h-11 text-[#0f766e] hover:text-[#083344] border border-dashed border-[#085a70]/20 rounded-2xl hover:bg-slate-100 text-xs font-black uppercase tracking-wider">
                + Add Trusted Contact
              </Button>
            </div>
          </div>
        </section>

        {/* Safe Zones */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <MapPin size={12} className="text-white" />
            </div>
            <h2 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest">Safe Zones</h2>
          </div>
          <div className="bg-slate-50 rounded-3xl border border-[#085a70]/10 shadow-sm divide-y divide-[#085a70]/5">
            {[
              { name: "🏠 Home", address: "Sector 12, Phase 2" },
              { name: "🏫 College", address: "University Road" },
            ].map((z) => (
              <div key={z.name} className="p-4 flex justify-between items-center">
                <div>
                  <span className="text-xs font-extrabold text-[#083344] block uppercase tracking-wider">{z.name}</span>
                  <span className="text-[10px] text-[#0f766e] font-semibold">{z.address}</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 transition-colors">Edit</button>
              </div>
            ))}
            <div className="p-4">
              <Button variant="ghost" className="w-full h-11 text-[#0f766e] hover:text-[#083344] border border-dashed border-[#085a70]/20 rounded-2xl hover:bg-slate-100 text-xs font-black uppercase tracking-wider">
                + Add Safe Zone
              </Button>
            </div>
          </div>
        </section>

        {/* Emergency Settings */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
              <SettingsIcon size={12} className="text-white" />
            </div>
            <h2 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest">Emergency Settings</h2>
          </div>
          <div className="bg-slate-50 rounded-3xl border border-[#085a70]/10 shadow-sm p-5 space-y-5">
            <div className="flex justify-between items-center gap-4">
              <Label className="text-xs font-extrabold text-[#083344] uppercase tracking-wider">Auto-escalation delay</Label>
              <Input defaultValue="60s" className="w-20 h-9 text-right bg-white border-[#085a70]/15 text-[#083344] font-bold focus:border-[#0d9488]/50 rounded-xl" />
            </div>
            <div className="flex justify-between items-center gap-4">
              <Label className="text-xs font-extrabold text-[#083344] uppercase tracking-wider">Check-in interval</Label>
              <Input defaultValue="5min" className="w-24 h-9 text-right bg-white border-[#085a70]/15 text-[#083344] font-bold focus:border-[#0d9488]/50 rounded-xl" />
            </div>
            <div className="flex justify-between items-center gap-4">
              <Label className="text-xs font-extrabold text-[#083344] uppercase tracking-wider">SOS countdown</Label>
              <Input defaultValue="2s" className="w-20 h-9 text-right bg-white border-[#085a70]/15 text-[#083344] font-bold focus:border-[#0d9488]/50 rounded-xl" />
            </div>
            <div className="pt-4 border-t border-[#085a70]/10 space-y-4">
              {[
                { label: "Auto-call local police helpline", checked: false },
                { label: "Share coordinates with loved ones", checked: true },
                { label: "Trigger deterrent screech alarm", checked: true },
              ].map((opt) => (
                <div key={opt.label} className="flex justify-between items-center">
                  <Label className="text-xs font-extrabold text-[#083344] uppercase tracking-wider leading-relaxed pr-2">{opt.label}</Label>
                  <Switch defaultChecked={opt.checked} className="data-[state=checked]:bg-[#0d9488]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guardian Status */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Heart size={12} className="text-white" />
            </div>
            <h2 className="text-xs font-black text-[#083344]/80 uppercase tracking-widest">My Guardian Status</h2>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-teal-50/10 border border-[#0d9488]/20 rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider block mb-1">Status</span>
                <span className="text-[#083344] font-black flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active & Online
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider block mb-1">Availability</span>
                <span className="text-[#0f766e] text-xs font-black">6 PM – 11 PM</span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-11 bg-white border-[#085a70]/10 text-[#083344] hover:bg-slate-50 rounded-xl text-xs font-black uppercase tracking-wider">
              Edit Availability Hours
            </Button>
          </div>
          
          <div className="mt-4 bg-slate-50 border border-[#085a70]/10 rounded-3xl p-5 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-[#085a70] flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Star size={20} className="text-white" />
            </div>
            <p className="text-xs text-[#083344] mb-1 font-black uppercase tracking-wider">Elevate your credentials</p>
            <p className="text-[10px] text-[#0f766e] mb-4 font-semibold leading-relaxed">Requires official ID, background checks, and community verification probation.</p>
            <Link href="/guardian-onboarding">
              <Button className="w-full h-12 rounded-full bg-gradient-to-br from-[#0d9488] to-[#085a70] text-white hover:brightness-105 font-black text-xs uppercase tracking-widest shadow-md">
                Apply for Official Verification
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
