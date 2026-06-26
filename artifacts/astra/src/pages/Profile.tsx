import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { User, Shield, Phone, MapPin, Settings as SettingsIcon, Heart, ChevronRight, Bell, Clock, Users, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserData {
  name: string;
  initials: string;
  avatar: string | null;
}

const gradientColors = ["from-rose-400 to-pink-500", "from-violet-400 to-purple-500", "from-teal-400 to-emerald-500", "from-amber-400 to-orange-500", "from-blue-400 to-indigo-500"];

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
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-14 pb-6 bg-white border-b border-slate-100">
        <button onClick={() => setLocation("/home")} className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-2 font-medium mb-4">
          ← Back
        </button>
        <div className="flex items-center gap-5">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradient(user.name)} flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-rose-200`}>
            {user.avatar || user.initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                <Star size={14} fill="currentColor" /> 4.8
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-500">12 helps</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold flex items-center gap-1">
                <Shield size={10} /> Guardian
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 font-semibold">Score 92</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-28 space-y-6">
        
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Shield size={18} />, label: "Safety Score", color: "from-violet-500 to-purple-600", href: "/dashboard" },
            { icon: <Users size={18} />, label: "Guardians", color: "from-teal-400 to-emerald-500", href: "/guardians" },
            { icon: <Clock size={18} />, label: "Timeline", color: "from-amber-400 to-orange-500", href: "/dashboard" },
          ].map((item) => (
            <button key={item.label} onClick={() => setLocation(item.href)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.97]">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
                <span className="text-white">{item.icon}</span>
              </div>
              <span className="text-xs font-semibold text-slate-600">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Guardian Preference */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <Shield size={12} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-slate-700">Guardian Preference</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <RadioGroup defaultValue="female" className="gap-3">
              {[
                { value: "community", label: "Community members only" },
                { value: "female", label: "Female guardians only" },
                { value: "verified", label: "Verified guardians" },
                { value: "police", label: "Police-verified only" },
              ].map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value={opt.value} id={opt.value} className="text-rose-500" />
                  <Label htmlFor={opt.value} className="text-sm font-medium text-slate-600">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-3">
              <Checkbox id="c1" defaultChecked className="text-rose-500" />
              <Label htmlFor="c1" className="text-sm text-slate-500 leading-tight">If no match, expand to nearest available</Label>
            </div>
          </div>
        </section>

        {/* Trusted Contacts */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Phone size={12} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-slate-700">Trusted Contacts</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
            {[
              { name: "Mom", relation: "Emergency contact" },
              { name: "Sister", relation: "Emergency contact" },
            ].map((c) => (
              <div key={c.name} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold text-slate-600">
                    {c.name[0]}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700 block">{c.name}</span>
                    <span className="text-xs text-slate-400">{c.relation}</span>
                  </div>
                </div>
                <button className="text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">Edit</button>
              </div>
            ))}
            <div className="p-4">
              <Button variant="ghost" className="w-full h-11 text-slate-400 hover:text-slate-600 border border-dashed border-slate-200 rounded-xl hover:bg-slate-50">
                + Add Contact
              </Button>
            </div>
          </div>
        </section>

        {/* Safe Zones */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <MapPin size={12} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-slate-700">Safe Zones</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
            {[
              { name: "🏠 Home", address: "Sector 12, Phase 2" },
              { name: "🏫 College", address: "University Road" },
            ].map((z) => (
              <div key={z.name} className="p-4 flex justify-between items-center">
                <div>
                  <span className="text-sm font-semibold text-slate-700 block">{z.name}</span>
                  <span className="text-xs text-slate-400">{z.address}</span>
                </div>
                <button className="text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">Edit</button>
              </div>
            ))}
            <div className="p-4">
              <Button variant="ghost" className="w-full h-11 text-slate-400 hover:text-slate-600 border border-dashed border-slate-200 rounded-xl hover:bg-slate-50">
                + Add Zone
              </Button>
            </div>
          </div>
        </section>

        {/* Emergency Settings */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
              <SettingsIcon size={12} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-slate-700">Emergency Settings</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
            <div className="flex justify-between items-center gap-4">
              <Label className="text-sm font-medium text-slate-700">Auto-escalation delay</Label>
              <Input defaultValue="60s" className="w-20 h-9 text-right bg-slate-50 border-slate-200 text-slate-700" />
            </div>
            <div className="flex justify-between items-center gap-4">
              <Label className="text-sm font-medium text-slate-700">Check-in interval</Label>
              <Input defaultValue="5min" className="w-24 h-9 text-right bg-slate-50 border-slate-200 text-slate-700" />
            </div>
            <div className="flex justify-between items-center gap-4">
              <Label className="text-sm font-medium text-slate-700">SOS countdown</Label>
              <Input defaultValue="2s" className="w-20 h-9 text-right bg-slate-50 border-slate-200 text-slate-700" />
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-4">
              {[
                { label: "Auto-call police", checked: false },
                { label: "Share location with family", checked: true },
                { label: "Deterrent alarm", checked: true },
              ].map((opt) => (
                <div key={opt.label} className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-slate-700">{opt.label}</Label>
                  <Switch defaultChecked={opt.checked} className="data-[state=checked]:bg-rose-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guardian Status */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <Heart size={12} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-slate-700">My Guardian Status</h2>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block mb-1">Status</span>
                <span className="text-slate-800 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block mb-1">Availability</span>
                <span className="text-slate-700 text-sm font-medium">6 PM – 11 PM</span>
              </div>
            </div>
            <Button variant="outline" className="w-full h-11 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl">
              Edit Hours
            </Button>
          </div>
          
          <div className="mt-4 bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Star size={20} className="text-white" />
            </div>
            <p className="text-sm text-slate-700 mb-1 font-semibold">Want to do more?</p>
            <p className="text-xs text-slate-400 mb-4">Requires: ID + 2 community vouches + 30-day probation</p>
            <Link href="/guardian-onboarding">
              <Button className="w-full h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 font-semibold shadow-md shadow-rose-200">
                Apply for Verification
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}