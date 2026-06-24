import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Upload, Video, Users, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GuardianOnboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);

  const nextStep = () => Math.min(step + 1, 4);
  const prevStep = () => Math.max(step - 1, 1);

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col">
      {/* Header & Stepper */}
      <div className="p-4 pt-12 sticky top-0 bg-background/90 backdrop-blur z-10 border-b border-border">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => step === 1 ? setLocation("/profile") : setStep(prevStep)} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2 font-medium" data-testid="btn-back">
            ← {step === 1 ? "Cancel" : "Back"}
          </button>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Step {step}/4</span>
        </div>
        
        <div className="flex gap-2 w-full">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <h1 className="text-3xl font-display font-bold text-white mb-2">Verify Identity</h1>
              <p className="text-muted-foreground text-sm mb-8">We need to confirm you are who you say you are.</p>
              
              <div className="space-y-4 flex-1">
                <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-card hover:bg-accent cursor-pointer transition-colors">
                  <Upload className="text-muted-foreground mb-4" size={24} />
                  <span className="font-medium text-white mb-1">Government ID Proof</span>
                  <span className="text-xs text-muted-foreground">Tap to upload front & back</span>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-card hover:bg-accent cursor-pointer transition-colors">
                  <Upload className="text-muted-foreground mb-4" size={24} />
                  <span className="font-medium text-white mb-1">Address Proof</span>
                  <span className="text-xs text-muted-foreground">Utility bill or bank statement</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <h1 className="text-3xl font-display font-bold text-white mb-2">Video Intro</h1>
              <p className="text-muted-foreground text-sm mb-8">Record a quick 30-second hello for the community.</p>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full aspect-[3/4] bg-card border border-border rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                  <Video className="text-muted-foreground mb-4" size={40} />
                  <span className="font-medium text-white mb-2">Record Introduction</span>
                  <span className="text-xs text-muted-foreground px-8 text-center">State your name and why you want to be a guardian.</span>
                  
                  <div className="absolute bottom-6 flex justify-center w-full">
                    <button className="w-16 h-16 rounded-full bg-primary flex items-center justify-center border-4 border-background shadow-lg">
                      <div className="w-5 h-5 bg-white rounded-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <h1 className="text-3xl font-display font-bold text-white mb-2">Community Vouches</h1>
              <p className="text-muted-foreground text-sm mb-8">You need 2 existing guardians to vouch for you.</p>
              
              <div className="space-y-4 flex-1">
                <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">AF</div>
                    <div>
                      <div className="font-medium text-white text-sm">Ananya F.</div>
                      <div className="text-xs text-muted-foreground">Guardian since 2023</div>
                    </div>
                  </div>
                  <div className="bg-secondary/20 text-secondary p-1.5 rounded-full">
                    <Check size={16} />
                  </div>
                </div>
                
                <Button variant="outline" className="w-full h-16 rounded-2xl border-dashed border-2 border-border bg-transparent hover:bg-card text-muted-foreground font-medium flex items-center justify-center gap-2">
                  <Users size={18} /> Request from another guardian
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
              <h1 className="text-3xl font-display font-bold text-white mb-2">Probation Period</h1>
              <p className="text-muted-foreground text-sm mb-8">Final step! You must complete a 30-day supervised period.</p>
              
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center flex-1 justify-center relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-muted">
                  <div className="h-full bg-primary w-[7%]" />
                </div>
                <Clock className="text-primary mb-6" size={48} />
                <h3 className="text-xl font-display font-bold text-white mb-2">Ready to start?</h3>
                <p className="text-sm text-muted-foreground mb-6">During probation, your responses will be monitored by senior guardians.</p>
                <div className="flex justify-between w-full text-xs font-bold uppercase tracking-widest px-4 border-t border-border pt-6">
                  <span className="text-muted-foreground">Responses: 0/3</span>
                  <span className="text-secondary">28 days left</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8">
          <Button 
            className="w-full h-14 rounded-full bg-primary text-white hover:bg-primary/90 font-bold text-lg" 
            onClick={() => step < 4 ? setStep(nextStep) : setLocation("/profile")}
            data-testid={step < 4 ? "btn-next-step" : "btn-submit-application"}
          >
            {step < 4 ? "Continue" : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
}
