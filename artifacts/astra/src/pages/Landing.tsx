import { useLocation } from 'wouter'
import { Shield, Users, Navigation, Bell, ChevronDown, Star, MapPin } from 'lucide-react'

const STEPS = [
  {
    icon: Navigation,
    title: 'Start Walking',
    desc: 'Enter your destination. Astra plans the safest route based on real-time community data.',
  },
  {
    icon: Shield,
    title: 'AI Monitors Your Route',
    desc: 'Our 10 autonomous agents watch for incidents, deviations, and changes in your area.',
  },
  {
    icon: Users,
    title: 'Guardians Watch Over You',
    desc: 'Verified community guardians are nearby, ready to respond within minutes.',
  },
  {
    icon: Bell,
    title: 'You Arrive Safe',
    desc: 'Check-in, mark safe arrival, or trigger SOS — the network responds instantly.',
  },
]

const TESTIMONIALS = [
  {
    text: 'Astra makes my late-night commute so much less stressful. Just knowing guardians are nearby changes everything.',
    name: 'Sneha R.',
    city: 'Bangalore',
  },
  {
    text: 'I triggered the SOS once and within 2 minutes Ananya was there. I still get chills thinking about it.',
    name: 'Kavya M.',
    city: 'Hyderabad',
  },
  {
    text: 'As a guardian, I love being able to help my community. The app makes it easy to know who needs support.',
    name: 'Rahul K.',
    city: 'Pune',
  },
]

const STATS = [
  { value: '50K+', label: 'Women Protected' },
  { value: '12K+', label: 'Active Guardians' },
  { value: '98%', label: 'Safe Arrivals' },
  { value: '< 3 min', label: 'Avg Response Time' },
]

export default function Landing() {
  const [, navigate] = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <Shield size={22} className="text-primary" fill="currentColor" fillOpacity={0.2} />
          <span className="font-bold text-lg tracking-tight text-foreground">ASTRA</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#how" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm px-4 py-2 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-16 pb-12 flex flex-col items-center text-center overflow-hidden">
        {/* Background guardian dots illustration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
            {/* Connection threads */}
            <line x1="200" y1="200" x2="80" y2="120" stroke="#E07A5F" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="200" y1="200" x2="320" y2="100" stroke="#F2CC8F" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="200" y1="200" x2="350" y2="280" stroke="#81B29A" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="200" y1="200" x2="50" y2="310" stroke="#E07A5F" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="200" y1="200" x2="160" y2="320" stroke="#F2CC8F" strokeWidth="1" strokeDasharray="4,4" />
            {/* Guardian dots */}
            <circle cx="80" cy="120" r="8" fill="#F2CC8F" opacity="0.6" />
            <circle cx="320" cy="100" r="8" fill="#F2CC8F" opacity="0.6" />
            <circle cx="350" cy="280" r="6" fill="#F2CC8F" opacity="0.4" />
            <circle cx="50" cy="310" r="7" fill="#F2CC8F" opacity="0.5" />
            <circle cx="160" cy="320" r="5" fill="#F2CC8F" opacity="0.4" />
            {/* Streetlights */}
            <circle cx="120" cy="200" r="3" fill="#F2CC8F" opacity="0.8" />
            <circle cx="280" cy="200" r="3" fill="#F2CC8F" opacity="0.8" />
            <circle cx="200" cy="80" r="3" fill="#F2CC8F" opacity="0.6" />
            {/* User dot */}
            <circle cx="200" cy="200" r="14" fill="#E07A5F" opacity="0.15" />
            <circle cx="200" cy="200" r="8" fill="#E07A5F" opacity="0.6" />
            <circle cx="200" cy="200" r="4" fill="#E07A5F" />
          </svg>
        </div>

        <div className="relative z-10 max-w-sm mx-auto">
          {/* Tagline chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/30 border border-accent/40 text-xs font-semibold text-foreground/80 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Women-first safety companion
          </div>

          {/* Hero illustration */}
          <div className="relative mb-8 mx-auto" style={{ width: 200, height: 200 }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-primary/10 border border-accent/20" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              {/* Walking woman silhouette */}
              <circle cx="100" cy="55" r="18" fill="#E07A5F" opacity="0.8" />
              <path d="M85 73 Q100 85 115 73 L120 130 Q100 140 80 130 Z" fill="#E07A5F" opacity="0.7" />
              <line x1="80" y1="130" x2="70" y2="165" stroke="#E07A5F" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
              <line x1="120" y1="130" x2="130" y2="165" stroke="#E07A5F" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
              {/* Guardian pulses */}
              <circle cx="50" cy="90" r="10" fill="#F2CC8F" opacity="0.4" />
              <circle cx="50" cy="90" r="6" fill="#F2CC8F" opacity="0.7" />
              <circle cx="150" cy="110" r="10" fill="#F2CC8F" opacity="0.4" />
              <circle cx="150" cy="110" r="6" fill="#F2CC8F" opacity="0.7" />
              <circle cx="100" cy="160" r="8" fill="#F2CC8F" opacity="0.3" />
              <circle cx="100" cy="160" r="5" fill="#F2CC8F" opacity="0.6" />
              {/* Connection lines */}
              <line x1="100" y1="100" x2="50" y2="90" stroke="#F2CC8F" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
              <line x1="100" y1="100" x2="150" y2="110" stroke="#F2CC8F" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
              {/* Route path */}
              <path d="M100 170 Q105 150 100 130" stroke="#81B29A" strokeWidth="2" fill="none" strokeDasharray="4,3" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3 leading-none">
            ASTRA
          </h1>
          <p className="text-xl font-semibold text-primary mb-2">You Are Never Alone</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10 px-4">
            Predictive AI safety with a real community of guardians — protecting you before danger strikes.
          </p>

          <div className="flex flex-col gap-3 px-4">
            <button
              onClick={() => navigate('/walk')}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-md hover:opacity-90 active:scale-98 transition-all"
            >
              Start Walking
            </button>
            <button
              onClick={() => navigate('/guardians')}
              className="w-full py-4 rounded-2xl bg-background border-2 border-accent text-foreground font-bold text-base hover:bg-accent/10 transition-all"
            >
              Join as Guardian
            </button>
          </div>

          <a href="#how" className="mt-8 flex flex-col items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <span>How it works</span>
            <ChevronDown size={16} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-8 bg-foreground text-background">
        <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
          {STATS.map((s) => (
            <div key={s.value} className="text-center">
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs opacity-70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-12">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">How it works</span>
            <h2 className="text-2xl font-black text-foreground mt-2">Safety in 4 steps</h2>
          </div>
          <div className="flex flex-col gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="flex gap-4 p-4 bg-card rounded-2xl border border-card-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-semibold text-foreground">{step.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-10 bg-card border-y border-card-border">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Community voices</span>
            <h2 className="text-2xl font-black text-foreground mt-2">Real stories</h2>
          </div>
          <div className="flex flex-col gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-4 bg-background rounded-2xl border border-border">
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} size={12} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={8} /> {t.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12 text-center">
        <div className="max-w-sm mx-auto">
          <Shield size={40} className="text-primary mx-auto mb-4" fill="currentColor" fillOpacity={0.15} />
          <h2 className="text-3xl font-black text-foreground mb-3">Join Astra today</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Be part of a community that keeps each other safe. Every guardian matters.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-md hover:opacity-90 transition-all"
          >
            Get Started — It's Free
          </button>
          <p className="text-xs text-muted-foreground mt-4">No credit card required · Works offline</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield size={16} className="text-primary" />
          <span className="font-bold text-sm text-foreground">ASTRA</span>
        </div>
        <p className="text-xs text-muted-foreground">You Are Never Alone · Vibe2Ship Hackathon 2026</p>
      </footer>
    </div>
  )
}
