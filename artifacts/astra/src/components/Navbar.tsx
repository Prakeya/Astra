import { Link, useLocation } from 'wouter'
import { Shield, Home, Navigation, Map, AlertCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/walk', label: 'Walk', icon: Navigation },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/sos', label: 'SOS', icon: AlertCircle, emergency: true },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const [location] = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon, emergency }) => {
          const active = location === href || (href === '/dashboard' && location === '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200',
                emergency
                  ? 'bg-destructive text-destructive-foreground shadow-md scale-110 -translate-y-2 px-4 py-2'
                  : active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={emergency ? 22 : 20} strokeWidth={emergency ? 2.5 : active ? 2.5 : 1.8} />
              <span className={cn('text-xs font-medium', emergency && 'font-bold')}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function TopBar({
  title,
  showBack = false,
  right,
}: {
  title: string
  showBack?: boolean
  right?: React.ReactNode
}) {
  const [, navigate] = useLocation()
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
      {showBack && (
        <button
          onClick={() => navigate('/dashboard')}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-foreground"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
      {!showBack && (
        <div className="flex items-center gap-2">
          <Shield size={22} className="text-primary" fill="currentColor" fillOpacity={0.2} />
        </div>
      )}
      <h1 className="flex-1 text-lg font-bold text-foreground tracking-tight">{title}</h1>
      {right}
    </header>
  )
}
