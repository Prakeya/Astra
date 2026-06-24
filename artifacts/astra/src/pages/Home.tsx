import { motion } from "framer-motion";
import { Link } from "wouter";
import { MapBackground } from "@/components/MapBackground";
import { Button } from "@/components/ui/button";

export function Home() {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col">
      <MapBackground />
      
      <div className="relative z-10 p-6 pt-12 flex flex-col h-full">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display font-bold text-3xl tracking-wide text-white drop-shadow-md"
        >
          Astra
        </motion.h1>

        <div className="mt-auto mb-16 flex flex-col gap-4">
          <Link href="/walk" className="w-full block">
            <Button className="w-full rounded-full h-16 text-xl font-medium bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" data-testid="btn-start-walking">
              Start Walking →
            </Button>
          </Link>
          <div className="bg-background/80 backdrop-blur-md rounded-2xl p-4 border border-border flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-foreground font-medium">Last walk: Home → College</span>
              <span className="text-xs text-muted-foreground mt-1">12 min · 3 guardians · Safe</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
