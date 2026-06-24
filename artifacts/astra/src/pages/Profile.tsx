import { Link, useLocation } from "wouter";
import { User, Shield, Phone, MapPin, Settings as SettingsIcon, Heart } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Profile() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col pb-6">
      <div className="p-4 pt-12 sticky top-0 bg-background/90 backdrop-blur z-10 border-b border-border">
        <button onClick={() => setLocation("/home")} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2 font-medium" data-testid="btn-back">
          ← Profile
        </button>
      </div>

      <div className="p-6">
        {/* User Card */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold">
            PS
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Priya Sharma</h1>
            <p className="text-sm text-secondary font-medium mt-1 flex items-center gap-1">
              ⭐ Guardian Score: 4.8 · 12 helps
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Guardian Preference */}
          <section>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><Shield size={14} /> Guardian Preference</h2>
            <div className="bg-card border border-border rounded-2xl p-5">
              <RadioGroup defaultValue="female" className="gap-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="community" id="r1" />
                  <Label htmlFor="r1" className="text-sm font-medium">Community members only</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="female" id="r2" />
                  <Label htmlFor="r2" className="text-sm font-medium">Female guardians only</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="verified" id="r3" />
                  <Label htmlFor="r3" className="text-sm font-medium">Verified guardians</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="police" id="r4" />
                  <Label htmlFor="r4" className="text-sm font-medium">Police-verified only</Label>
                </div>
              </RadioGroup>
              <div className="mt-6 pt-4 border-t border-border flex items-center space-x-3">
                <Checkbox id="c1" defaultChecked />
                <Label htmlFor="c1" className="text-sm text-muted-foreground leading-tight">If no match, expand to nearest available</Label>
              </div>
            </div>
          </section>

          {/* Trusted Contacts */}
          <section>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><Phone size={14} /> Trusted Contacts</h2>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-white">Mom</span>
                <button className="text-xs text-primary font-medium">Edit</button>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-white">Sister</span>
                <button className="text-xs text-primary font-medium">Edit</button>
              </div>
              <div className="p-4">
                <Button variant="ghost" className="w-full h-10 text-secondary hover:text-secondary/90 hover:bg-secondary/10 border border-dashed border-secondary/30">
                  + Add Contact
                </Button>
              </div>
            </div>
          </section>

          {/* Safe Zones */}
          <section>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={14} /> Safe Zones</h2>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-white">Home</span>
                <button className="text-xs text-primary font-medium">Edit</button>
              </div>
              <div className="p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-white">College</span>
                <button className="text-xs text-primary font-medium">Edit</button>
              </div>
              <div className="p-4">
                <Button variant="ghost" className="w-full h-10 text-secondary hover:text-secondary/90 hover:bg-secondary/10 border border-dashed border-secondary/30">
                  + Add Zone
                </Button>
              </div>
            </div>
          </section>

          {/* Emergency Settings */}
          <section>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><SettingsIcon size={14} /> Emergency Settings</h2>
            <div className="bg-card border border-border rounded-2xl p-5 space-y-6">
              <div className="flex justify-between items-center gap-4">
                <Label className="text-sm font-medium text-white">Auto-escalation delay</Label>
                <Input defaultValue="60s" className="w-20 h-8 text-right bg-background" />
              </div>
              <div className="flex justify-between items-center gap-4">
                <Label className="text-sm font-medium text-white">Check-in interval</Label>
                <Input defaultValue="5min" className="w-24 h-8 text-right bg-background" />
              </div>
              <div className="flex justify-between items-center gap-4">
                <Label className="text-sm font-medium text-white">SOS countdown</Label>
                <Input defaultValue="2s" className="w-20 h-8 text-right bg-background" />
              </div>
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-white">Auto-call police</Label>
                  <Switch />
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-white">Share location with family</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-white">Deterrent alarm</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </section>

          {/* Guardian Status */}
          <section>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><Heart size={14} /> My Guardian Status</h2>
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Status</span>
                  <span className="text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Active
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Availability</span>
                  <span className="text-white text-sm font-medium">6 PM – 11 PM</span>
                </div>
              </div>
              <Button variant="outline" className="w-full h-10 bg-background border-border text-foreground hover:bg-accent mt-2">
                Edit Hours
              </Button>
            </div>
            
            <div className="mt-4 bg-card border border-border rounded-2xl p-5 text-center">
              <p className="text-sm text-white mb-2 font-medium">Want to do more?</p>
              <p className="text-xs text-muted-foreground mb-4">Requires: ID + 2 community vouches + 30-day probation</p>
              <Link href="/guardian-onboarding">
                <Button className="w-full h-12 rounded-full bg-primary text-white hover:bg-primary/90 font-medium">
                  Apply for Verification
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
