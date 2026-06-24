import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, Users, Shield, Settings, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MenuDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  
  const handleItemClick = (item: string) => {
    toast({
      title: "Coming soon",
      description: `${item} will be available in the next update.`,
    });
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-[430px] mx-auto bg-card border-border border-t">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="font-display text-2xl">Menu</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8 h-[60vh] overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dashboard" className="border-border">
              <AccordionTrigger className="hover:no-underline hover:text-primary">
                <div className="flex items-center gap-3"><Activity size={20} className="text-secondary" /> Dashboard</div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pl-8 text-muted-foreground">
                <button onClick={() => handleItemClick('Safety Score')} className="text-left hover:text-foreground">Safety Score</button>
                <button onClick={() => handleItemClick('Stats')} className="text-left hover:text-foreground">Stats</button>
                <button onClick={() => handleItemClick('Leaderboard')} className="text-left hover:text-foreground">Leaderboard</button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="community" className="border-border">
              <AccordionTrigger className="hover:no-underline hover:text-primary">
                <div className="flex items-center gap-3"><Users size={20} className="text-secondary" /> Community</div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pl-8 text-muted-foreground">
                <button onClick={() => handleItemClick('Guardians Nearby')} className="text-left hover:text-foreground">Guardians Nearby</button>
                <button onClick={() => handleItemClick('Report Issue')} className="text-left hover:text-foreground">Report Issue</button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="safety-tools" className="border-border">
              <AccordionTrigger className="hover:no-underline hover:text-primary">
                <div className="flex items-center gap-3"><Shield size={20} className="text-secondary" /> Safety Tools</div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pl-8 text-muted-foreground">
                <button onClick={() => handleItemClick('Distraction Call')} className="text-left hover:text-foreground">Distraction Call</button>
                <button onClick={() => handleItemClick('Check-in Timer')} className="text-left hover:text-foreground">Check-in Timer</button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="settings" className="border-border">
              <AccordionTrigger className="hover:no-underline hover:text-primary">
                <div className="flex items-center gap-3"><Settings size={20} className="text-secondary" /> Settings</div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pl-8 text-muted-foreground">
                <button onClick={() => handleItemClick('Trusted Contacts')} className="text-left hover:text-foreground">Trusted Contacts</button>
                <button onClick={() => handleItemClick('Safe Zones')} className="text-left hover:text-foreground">Safe Zones</button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="guardian" className="border-border">
              <AccordionTrigger className="hover:no-underline hover:text-primary">
                <div className="flex items-center gap-3"><Heart size={20} className="text-primary" /> Guardian</div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pl-8 text-muted-foreground">
                <button onClick={() => handleItemClick('My Availability')} className="text-left hover:text-foreground">My Availability</button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
