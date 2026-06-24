import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Landing() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative bg-[#060a16] overflow-hidden">
      {/* Nature illustration background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#060a16] z-10" />
        <svg className="absolute w-full h-full opacity-30" preserveAspectRatio="xMidYMax slice" viewBox="0 0 100 100">
          <path d="M0,100 C20,80 40,90 60,70 C80,50 90,60 100,50 L100,100 Z" fill="#0f172a" />
          <path d="M0,100 C30,90 50,70 70,80 C90,90 100,70 100,100 Z" fill="#1e293b" />
          <circle cx="80" cy="30" r="15" fill="#f8fafc" opacity="0.1" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col justify-end p-8 pb-16 z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold font-display text-white mb-4 tracking-tight">Hello, I'm Astra.</h1>
          <p className="text-xl text-muted-foreground font-medium">You are never alone.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-4 w-full"
        >
          <Link href="/home" className="w-full">
            <Button size="lg" className="w-full rounded-full h-14 text-lg font-medium bg-primary hover:bg-primary/90 text-white" data-testid="btn-create-account">
              Create Account
            </Button>
          </Link>
          <Link href="/home" className="w-full">
            <Button size="lg" variant="outline" className="w-full rounded-full h-14 text-lg font-medium border-border text-foreground hover:bg-white/5" data-testid="btn-sign-in">
              Sign In
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
