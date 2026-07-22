import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Activity, Users, Shield, ShieldCheck,
  BarChart3, Trophy, Clock, Map, AlertTriangle,
  Globe, Phone, Timer, Mic,
  UserCheck, UserCog, Star, ChevronRight, Settings, Bell
} from "lucide-react";
import { useLocation } from "wouter";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
}

const sectionColors: Record<string, string> = {
  dashboard: "from-cyan-500 to-teal-600",
  community: "from-teal-400 to-cyan-500",
  "safety-tools": "from-cyan-400 to-teal-500",
  settings: "from-slate-400 to-slate-500",
  guardian: "from-teal-500 to-cyan-500",
};

const sectionIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  dashboard: { icon: <Activity className="text-white" />, color: "text-cyan-600" },
  community: { icon: <Users className="text-white" />, color: "text-teal-600" },
  "safety-tools": { icon: <Shield className="text-white" />, color: "text-cyan-600" },
  settings: { icon: <Settings className="text-white" />, color: "text-slate-600" },
  guardian: { icon: <ShieldCheck className="text-white" />, color: "text-teal-600" },
};

const SECTIONS: Section[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Activity size={15} />,
    items: [
      { label: "Safety Score", icon: <Shield size={15}/>, href: "/dashboard" },
      { label: "My Stats", icon: <BarChart3 size={15}/>, href: "/dashboard" },
      { label: "Leaderboard", icon: <Trophy size={15}/>, href: "/dashboard", badge: "Top 15%" },
      { label: "Activity Timeline", icon: <Clock size={15}/>, href: "/dashboard" },
    ],
  },
  {
    id: "community",
    title: "Community Network",
    icon: <Users size={15} />,
    items: [
      { label: "Guardians Nearby", icon: <Users size={15}/>, href: "/guardians", badge: "5 active" },
      { label: "Report Issue", icon: <AlertTriangle size={15}/>, href: "/report" },
      { label: "Community Impact", icon: <Globe size={15}/>, href: "/community" },
      { label: "Incident Map", icon: <Map size={15}/>, href: "/incident-map" },
    ],
  },
  {
    id: "safety-tools",
    title: "Defensive Tools",
    icon: <Shield size={15} />,
    items: [
      { label: "Distraction Call", icon: <Phone size={15}/>, href: "/distraction-call" },
      { label: "Check-in Timer", icon: <Timer size={15}/>, href: "/checkin" },
      { label: "Voice Activation", icon: <Mic size={15}/>, href: "/voice" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings size={15} />,
    items: [
      { label: "Trusted Contacts", icon: <UserCheck size={15}/>, href: "/profile" },
      { label: "Safe Zones", icon: <Map size={15}/>, href: "/profile" },
      { label: "Alert Preferences", icon: <Bell size={15}/>, href: "/profile" },
      { label: "Emergency Settings", icon: <AlertTriangle size={15}/>, href: "/profile" },
    ],
  },
  {
    id: "guardian",
    title: "Guardian Center",
    icon: <ShieldCheck size={15} />,
    items: [
      { label: "Become a Guardian", icon: <UserCog size={15}/>, href: "/guardian-onboarding" },
      { label: "My Availability", icon: <Clock size={15}/>, href: "/profile" },
      { label: "Reputation Status", icon: <Star size={15}/>, href: "/dashboard" },
    ],
  },
];

export function MenuDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [, setLocation] = useLocation();

  const navigate = (href: string) => {
    onOpenChange(false);
    setTimeout(() => setLocation(href), 150);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="max-w-[430px] mx-auto border-t border-[#085a70]/15 shadow-2xl rounded-t-[2.5rem]"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)" }}
      >
        <DrawerHeader className="text-left pb-0 pt-6 px-5">
          <DrawerTitle className="text-xl font-black text-[#083344] uppercase tracking-wider font-sans">
            Menu Options
          </DrawerTitle>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#085a70]/60 mt-1">Defensive Companion System</p>
        </DrawerHeader>

        <div className="px-4 pb-10 max-h-[64vh] overflow-y-auto mt-3 select-none">
          <Accordion type="single" collapsible className="w-full" defaultValue="dashboard">
            {SECTIONS.map(section => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-b last:border-0"
                style={{ borderColor: "rgba(8,90,112,0.06)" }}
              >
                <AccordionTrigger
                  className="hover:no-underline py-4 px-3 rounded-2xl hover:bg-[#0d9488]/5 transition-colors [&[data-state=open]]:bg-[#0d9488]/8 text-[#083344]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${sectionColors[section.id]} flex items-center justify-center shadow-sm`}>
                      {sectionIcons[section.id].icon}
                    </div>
                    <span className="text-[#083344] font-black text-sm tracking-wide">{section.title}</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-2">
                  <div className="flex flex-col gap-1 ml-11 mt-1">
                    {section.items.map(item => (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.href)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all hover:bg-[#0d9488]/5 active:bg-[#0d9488]/10 w-full group text-[#083344]/80"
                      >
                        <span className="text-[#085a70]/60 group-hover:text-[#085a70] transition-colors">{item.icon}</span>
                        <span className="text-xs text-[#083344] font-bold group-hover:text-[#0d9488] flex-1 transition-colors">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-[#0d9488]/15 text-[#0d9488]"
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight size={13} className="text-[#085a70]/40 group-hover:text-[#085a70]/80 transition-colors"/>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
