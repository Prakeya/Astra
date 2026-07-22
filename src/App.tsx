import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

import { Landing } from "@/pages/Landing";
import { Home } from "@/pages/Home";
import { WalkMode } from "@/pages/WalkMode";
import { SOSScreen } from "@/pages/SOSScreen";
import { SafeNow } from "@/pages/SafeNow";
import { Profile } from "@/pages/Profile";
import { GuardianOnboarding } from "@/pages/GuardianOnboarding";
import { Dashboard } from "@/pages/Dashboard";
import { GuardiansNearby } from "@/pages/GuardiansNearby";
import { ReportIssue } from "@/pages/ReportIssue";
import { CommunityImpact } from "@/pages/CommunityImpact";
import { DistractionCall } from "@/pages/DistractionCall";
import { CheckInTimer } from "@/pages/CheckInTimer";
import { IncidentMap } from "@/pages/IncidentMap";
import { VoiceActivation } from "@/pages/VoiceActivation";
import { CreateAccount } from "@/pages/CreateAccount";
import { BottomNav } from "@/components/BottomNav";
import { useVoiceActivation, VoiceTriggeredOverlay, VoiceStatusPill } from "@/components/VoiceListener";

const queryClient = new QueryClient();

const HIDE_NAV = ["/", "/sos"];

const VOICE_ENABLED_KEY = "astra_voice_enabled";

function GlobalVoiceListener() {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(VOICE_ENABLED_KEY) === "true"; } catch { return false; }
  });
  const [location] = useLocation();
  const active = enabled && location !== "/" && location !== "/sos" && location !== "/voice";
  const { listening, triggered } = useVoiceActivation(active);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      setEnabled(detail);
      localStorage.setItem(VOICE_ENABLED_KEY, String(detail));
    };
    window.addEventListener("astra:voiceEnabled", handler);
    return () => window.removeEventListener("astra:voiceEnabled", handler);
  }, []);

  return (
    <>
      <VoiceStatusPill listening={listening} />
      <VoiceTriggeredOverlay triggered={triggered} />
    </>
  );
}

function Router() {
  return (
    <>
      <GlobalVoiceListener />
      <main className="w-full flex-1">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/home" component={Home} />
          <Route path="/walk" component={WalkMode} />
          <Route path="/sos" component={SOSScreen} />
          <Route path="/safe" component={SafeNow} />
          <Route path="/profile" component={Profile} />
          <Route path="/guardian-onboarding" component={GuardianOnboarding} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/guardians" component={GuardiansNearby} />
          <Route path="/report" component={ReportIssue} />
          <Route path="/community" component={CommunityImpact} />
          <Route path="/distraction-call" component={DistractionCall} />
          <Route path="/checkin" component={CheckInTimer} />
          <Route path="/incident-map" component={IncidentMap} />
          <Route path="/voice" component={VoiceActivation} />
          <Route path="/create-account" component={CreateAccount} />
          <Route>
            <div className="p-8 text-center text-muted-foreground mt-20">Page not found</div>
          </Route>
        </Switch>
      </main>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="flex flex-col min-h-[100dvh] w-full">
            <Router />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
