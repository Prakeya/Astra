import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Activity, Users, Shield, Settings, Heart,
  BarChart3, Trophy, Clock, Map, AlertTriangle,
  Globe, Phone, Timer, Mic, Wifi,
  UserCheck, UserCog, Star, ChevronRight
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

const SECTIONS: Section[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Activity size={20} className="text-blue-400" />,
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
    icon: <Users size={20} className="text-teal-400" />,
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
    icon: <Shield size={20} className="text-green-400" />,
    items: [
      { label: "Distraction Call", icon: <Phone size={16}/>, href: "/distraction-call" },
      { label: "Check-in Timer", icon: <Timer size={16}/>, href: "/checkin" },
      { label: "Voice Activation", icon: <Mic size={16}/>, href: "/checkin", badge: "Soon" },
      { label: "Background Mode", icon: <Wifi size={16}/>, href: "/checkin", badge: "Soon" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings size={20} className="text-slate-400" />,
    items: [
      { label: "Trusted Contacts", icon: <UserCheck size={16}/>, href: "/profile" },
      { label: "Safe Zones", icon: <Map size={16}/>, href: "/profile" },
      { label: "Alert Preferences", icon: <Bell16/>, href: "/profile" },
      { label: "Emergency Settings", icon: <AlertTriangle size={16}/>, href: "/profile" },
    ],
  },
  {
    id: "guardian",
    title: "Guardian",
    icon: <Heart size={20} className="text-primary" />,
    items: [
      { label: "Become a Guardian", icon: <UserCog size={16}/>, href: "/guardian-onboarding" },
      { label: "My Availability", icon: <Clock size={16}/>, href: "/profile" },
      { label: "Guardian Reputation", icon: <Star size={16}/>, href: "/dashboard" },
    ],
  },
];

function Bell16() { return <Shield size={16}/>; }

export function MenuDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [, setLocation] = useLocation();

  const navigate = (href: string) => {
    onOpenChange(false);
    setTimeout(() => setLocation(href), 150);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="max-w-[430px] mx-auto border-t"
        style={{ background: "#0e1422", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <DrawerHeader className="text-left pb-0 pt-4 px-5">
          <DrawerTitle className="text-xl font-bold text-white">Menu</DrawerTitle>
          <p className="text-xs text-slate-500 mt-0.5">Everything else is here</p>
        </DrawerHeader>

        <div className="px-4 pb-10 max-h-[68vh] overflow-y-auto mt-2">
          <Accordion type="single" collapsible className="w-full" defaultValue="community">
            {SECTIONS.map(section => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-b last:border-0"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <AccordionTrigger
                  className="hover:no-underline py-4"
                  data-testid={`menu-section-${section.id}`}
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <span className="text-white font-semibold text-sm">{section.title}</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-2">
                  <div className="flex flex-col gap-0.5">
                    {section.items.map(item => (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.href)}
                        data-testid={`menu-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors hover:bg-white/5 active:bg-white/10 w-full"
                      >
                        <span className="text-slate-400">{item.icon}</span>
                        <span className="text-sm text-slate-200 flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: item.badge === "Soon" ? "rgba(100,116,139,0.2)" : "rgba(232,93,122,0.15)",
                              color: item.badge === "Soon" ? "#64748b" : "#e85d7a",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        {!item.badge && <ChevronRight size={14} className="text-slate-600"/>}
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
