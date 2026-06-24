import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 70,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 2,
}));

const FIREFLIES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 80 + 10,
  y: Math.random() * 30 + 55,
  delay: Math.random() * 4,
}));

function StarField() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {STARS.map((s) => (
        <motion.circle
          key={s.id}
          cx={s.x}
          cy={s.y}
          r={s.size * 0.3}
          fill="white"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.9, 0.1] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function NatureScene() {
  return (
    <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 430 320" preserveAspectRatio="xMidYMax meet">
      {/* Distant hills */}
      <path d="M0,220 C60,180 120,200 180,180 C240,160 300,190 430,170 L430,320 L0,320 Z" fill="#0d2a1f" opacity="0.8"/>
      {/* Mid hills */}
      <path d="M0,260 C50,230 110,250 160,235 C210,220 270,240 320,225 C370,210 400,235 430,220 L430,320 L0,320 Z" fill="#0a1f16" opacity="0.9"/>
      {/* Foreground ground */}
      <path d="M0,290 C80,270 180,280 260,268 C340,256 390,275 430,265 L430,320 L0,320 Z" fill="#061510"/>

      {/* Left tall tree */}
      <g transform="translate(30, 140)">
        <rect x="8" y="80" width="8" height="40" fill="#061510"/>
        <ellipse cx="12" cy="70" rx="18" ry="30" fill="#0d3a20"/>
        <ellipse cx="12" cy="55" rx="14" ry="22" fill="#0f4a28"/>
        <ellipse cx="12" cy="42" rx="10" ry="18" fill="#125530"/>
      </g>

      {/* Right cluster of trees */}
      <g transform="translate(320, 150)">
        <rect x="8" y="70" width="7" height="35" fill="#061510"/>
        <ellipse cx="11" cy="60" rx="16" ry="28" fill="#0d3a20"/>
        <ellipse cx="11" cy="46" rx="12" ry="20" fill="#0f4a28"/>
      </g>
      <g transform="translate(345, 155)">
        <rect x="6" y="60" width="6" height="30" fill="#061510"/>
        <ellipse cx="9" cy="52" rx="13" ry="22" fill="#0b3320"/>
        <ellipse cx="9" cy="40" rx="10" ry="17" fill="#0d4028"/>
      </g>
      <g transform="translate(370, 160)">
        <rect x="5" y="50" width="5" height="25" fill="#061510"/>
        <ellipse cx="7" cy="43" rx="11" ry="18" fill="#0d3a20"/>
        <ellipse cx="7" cy="33" rx="8" ry="14" fill="#125530"/>
      </g>

      {/* Small tent/campfire in center */}
      <g transform="translate(185, 240)">
        <polygon points="0,40 30,0 60,40" fill="#1a3a28" stroke="#2a5a3a" strokeWidth="0.5"/>
        <polygon points="10,40 30,10 50,40" fill="#133020" />
        {/* Door */}
        <ellipse cx="30" cy="40" rx="8" ry="10" fill="#0a1f16"/>
        {/* Campfire glow */}
        <motion.circle
          cx="30" cy="50" r="8"
          fill="#e05c2a"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: "30px 50px" }}
        />
        <motion.circle
          cx="30" cy="50" r="12"
          fill="#e07020"
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          style={{ transformOrigin: "30px 50px" }}
        />
      </g>

      {/* Small bushes */}
      <ellipse cx="90" cy="288" rx="20" ry="10" fill="#0a2810"/>
      <ellipse cx="110" cy="292" rx="15" ry="8" fill="#0d3015"/>
      <ellipse cx="340" cy="285" rx="18" ry="9" fill="#0a2810"/>
      <ellipse cx="360" cy="290" rx="12" ry="7" fill="#0d3015"/>

      {/* Path / trail */}
      <path d="M180,320 C185,300 195,285 200,270" stroke="#1a3a28" strokeWidth="3" fill="none" opacity="0.5"/>
      <path d="M250,320 C245,300 235,285 230,270" stroke="#1a3a28" strokeWidth="3" fill="none" opacity="0.5"/>

      {/* Moon */}
      <motion.circle
        cx="320" cy="60" r="22"
        fill="#e8f0d8"
        animate={{ opacity: [0.75, 0.95, 0.75] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <circle cx="312" cy="55" r="18" fill="#0d1a2e"/>

      {/* Fireflies */}
      {FIREFLIES.map((f) => (
        <motion.circle
          key={f.id}
          cx={f.x}
          cy={f.y}
          r="1.2"
          fill="#a8ff78"
          animate={{ opacity: [0, 0.9, 0.3, 0.8, 0] }}
          transition={{ duration: 2.5, delay: f.delay, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function AstraStar() {
  return (
    <motion.div
      className="relative"
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ width: 90, height: 90, left: -15, top: -15 }}
      />
      {/* Star SVG */}
      <svg width="60" height="60" viewBox="0 0 60 60">
        <motion.polygon
          points="30,5 35,22 52,22 39,33 43,50 30,40 17,50 21,33 8,22 25,22"
          fill="none"
          stroke="#e85d7a"
          strokeWidth="1.5"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "30px 30px" }}
        />
        <motion.polygon
          points="30,10 34,23 48,23 37,31 41,44 30,36 19,44 23,31 12,23 26,23"
          fill="#e85d7a"
          opacity="0.9"
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "30px 30px" }}
        />
        <circle cx="30" cy="30" r="6" fill="white" opacity="0.95"/>
      </svg>
    </motion.div>
  );
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 55);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      {!done && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>}
    </span>
  );
}

export function Landing() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden"
         style={{ background: "linear-gradient(to bottom, #040d1a 0%, #061520 35%, #081c14 70%, #061510 100%)" }}>
      
      {/* Stars */}
      <div className="absolute inset-0 z-0">
        <StarField />
      </div>

      {/* Shooting star */}
      <motion.div
        className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent z-10"
        style={{ width: 120, top: "15%", left: "-10%" }}
        animate={{ x: ["0%", "130vw"], y: ["0px", "60px"], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, delay: 2, repeat: Infinity, repeatDelay: 8 }}
      />

      {/* Nature scene */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-80">
        <NatureScene />
      </div>

      {/* Gradient overlay over nature */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-20"
           style={{ background: "linear-gradient(to top, #061510 0%, transparent 100%)" }} />

      {/* Main content */}
      <div className="relative z-30 flex flex-col items-center justify-center flex-1 px-8 pb-52 pt-16">
        
        {/* Astra star mascot */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6"
            >
              <AstraStar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greeting */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}>
                {phase >= 1 && <TypewriterText text="Hello, I'm Astra." delay={100} />}
              </h1>
              
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-base text-slate-400 font-medium tracking-wide"
                  >
                    You are never alone.
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tag line */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-4 text-sm text-slate-500 text-center max-w-xs leading-relaxed"
            >
              Your personal safety companion — calm by default, emergency-ready always.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-30 px-8 pb-16 flex flex-col gap-3">
        <AnimatePresence>
          {phase >= 3 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/home" className="block w-full">
                  <Button
                    size="lg"
                    className="w-full rounded-full h-14 text-base font-semibold text-white shadow-lg shadow-primary/30"
                    style={{ background: "linear-gradient(135deg, #e85d7a, #c23a5a)" }}
                    data-testid="btn-create-account"
                  >
                    Create Account
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/home" className="block w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full h-14 text-base font-medium border-white/20 text-white hover:bg-white/5 hover:border-white/40 bg-white/5 backdrop-blur-sm"
                    data-testid="btn-sign-in"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-xs text-slate-600 mt-1"
              >
                Trusted by 12,000+ women across 40 cities
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
