import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Activity, Users, Shield, Heart,
  BarChart3, Trophy, Clock, Map, AlertTriangle,
  Globe, Phone, Timer, Mic, Wifi,
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
  dashboard: "from-violet-500 to-purple-600",
  community: "from-teal-400 to-emerald-500",
  "safety-tools": "from-amber-400 to-orange-500",
  settings: "from-slate-400 to-slate-600",
  guardian: "from-rose-400 to-pink-500",
};

const sectionIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  dashboard: { icon: <Activity />, color: "text-violet-500" },
  community: { icon: <Users />, color: "text-teal-500" },
  "safety-tools": { icon: <Shield />, color: "text-amber-500" },
  settings: { icon: <Settings />, color: "text-slate-500" },
  guardian: { icon: <Heart />, color: "text-rose-500" },
};

const getIcon = (id: string) => {
  const data = sectionIcons[id];
  if (!data) return null;
  return (
    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sectionColors[id]} flex items-center justify-center shadow-sm`}>
      {data.icon}
    </div>
  );
};

const SECTIONS: Section[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Activity size={16} className="text-white" />,
    items: [
      { label: "Safety Score", icon: <Shield size={16}/>, href: "/dashboard" },
      { label: "My Stats", icon: <BarChart3 size={16}/>, href: "/dashboard" },
      { label: "Leaderboard", icon: <Trophy size={16}/>, href: "/dashboard", badge: "Top 15%" },
      { label: "Activity Timeline", icon: <Clock size={16}/>, href: "/dashboard" },
    ],
  },
  {
    id: "community",
    title: "Community",
    icon: <Users size={16} className="text-white" />,
    items: [
      { label: "Guardians Nearby", icon: <Users size={16}/>, href: "/guardians", badge: "5 active" },
      { label: "Report Issue", icon: <AlertTriangle size={16}/>, href: "/report" },
      { label: "Community Impact", icon: <Globe size={16}/>, href: "/community" },
      { label: "Incident Map", icon: <Map size={16}/>, href: "/incident-map" },
    ],
  },
  {
    id: "safety-tools",
    title: "Safety Tools",
    icon: <Shield size={16} className="text-white" />,
    items: [
      { label: "Distraction Call", icon: <Phone size={16}/>, href: "/distraction-call" },
      { label: "Check-in Timer", icon: <Timer size={16}/>, href: "/checkin" },
      { label: "Voice Activation", icon: <Mic size={16}/>, href: "/voice" },
      { label: "Background Mode", icon: <Wifi size={16}/>, href: "/voice", badge: "Soon" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings size={16} className="text-white" />,
    items: [
      { label: "Trusted Contacts", icon: <UserCheck size={16}/>, href: "/profile" },
      { label: "Safe Zones", icon: <Map size={16}/>, href: "/profile" },
      { label: "Alert Preferences", icon: <Bell size={16}/>, href: "/profile" },
      { label: "Emergency Settings", icon: <AlertTriangle size={16}/>, href: "/profile" },
    ],
  },
  {
    id: "guardian",
    title: "Guardian",
    icon: <Heart size={16} className="text-white" />,
    items: [
      { label: "Become a Guardian", icon: <UserCog size={16}/>, href: "/guardian-onboarding" },
      { label: "My Availability", icon: <Clock size={16}/>, href: "/profile" },
      { label: "Guardian Reputation", icon: <Star size={16}/>, href: "/dashboard" },
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
        className="max-w-[430px] mx-auto"
        style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0" }}
      >
        <DrawerHeader className="text-left pb-0 pt-6 px-5">
          <DrawerTitle className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Menu
          </DrawerTitle>
          <p className="text-sm text-slate-400 mt-1">Everything at your fingertips</p>
        </DrawerHeader>

        <div className="px-4 pb-10 max-h-[68vh] overflow-y-auto mt-3">
          <Accordion type="single" collapsible className="w-full" defaultValue="community">
            {SECTIONS.map(section => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-b last:border-0"
                style={{ borderColor: "#f1f5f9" }}
              >
                <AccordionTrigger
                  className="hover:no-underline py-4 px-3 rounded-xl hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sectionColors[section.id]} flex items-center justify-center shadow-sm`}>
                      {section.icon}
                    </div>
                    <span className="text-slate-800 font-semibold text-sm">{section.title}</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-2">
                  <div className="flex flex-col gap-0.5 ml-11">
                    {section.items.map(item => (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.href)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all hover:bg-slate-50 active:bg-slate-100 w-full group"
                      >
                        <span className="text-slate-400 group-hover:text-slate-600 transition-colors">{item.icon}</span>
                        <span className="text-sm text-slate-600 group-hover:text-slate-800 flex-1 transition-colors font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                            style={{
                              background: item.badge === "Soon" ? "#f1f5f9" : "#fef1f2",
                              color: item.badge === "Soon" ? "#64748b" : "#e11d48",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors"/>
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