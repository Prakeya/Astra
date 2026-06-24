import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { guardians } from "@/lib/mockData";

export function SafeNow() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden text-center">
      {/* Soft glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="w-20 h-20 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl">✨</span>
        </div>
        
        <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">You are safe.</h1>
        <p className="text-muted-foreground text-lg mb-10">Thank you.</p>

        <div className="bg-card border border-border rounded-2xl p-6 text-left mb-10">
          <div className="flex flex-col gap-4">
            {guardians.map((g, i) => (
              <motion.div 
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-sm"
              >
                <span className="text-xl">🙏</span>
                <span className="text-white font-medium">{g.name}</span>
                <span className="text-muted-foreground flex-1 text-right">
                  {g.status === "arriving" ? `arrived in ${g.eta}` : g.status === "police" ? "called police" : "stayed on line"}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="outline" className="w-full h-14 rounded-full border-border bg-card hover:bg-accent text-foreground font-medium" data-testid="btn-share-story">
            Share Story
          </Button>
          <Button variant="outline" className="w-full h-14 rounded-full border-border bg-card hover:bg-accent text-foreground font-medium" data-testid="btn-rate">
            Rate Guardians
          </Button>
          <Link href="/home" className="w-full">
            <Button className="w-full h-14 rounded-full bg-primary text-white hover:bg-primary/90 font-medium" data-testid="btn-done">
              Done
            </Button>
          </Link>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-xs text-muted-foreground mt-12 px-4 leading-relaxed"
        >
          This week: 47 guardians kept 203 women safe. You're one of them.
        </motion.p>
      </motion.div>
    </div>
  );
}
