import { useState } from 'react'
import { TopBar } from '../components/Navbar'
import sampleGuardians from '../data/sampleGuardians'
import { Shield, Star, MapPin, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '../context/AppContext'

export default function GuardiansNearby() {
  const { user, updateUser } = useApp()
  const [requested, setRequested] = useState<Set<string>>(new Set())
  const [isGuardian, setIsGuardian] = useState(user.isGuardian)

  const available = sampleGuardians.filter((g) => g.available)

  function requestHelp(id: string) {
    setRequested((prev) => new Set([...prev, id]))
  }

  function toggleGuardian() {
    setIsGuardian((v) => {
      updateUser({ isGuardian: !v })
      return !v
    })
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar
        title="Guardians Nearby"
        showBack
        right={
          <div className="flex items-center gap-1 text-xs font-semibold text-secondary">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            {available.length} online
          </div>
        }
      />

      <div className="px-4 pt-4 flex flex-col gap-3">
        {/* Header banner */}
        <div className="p-4 bg-accent/20 border border-accent/40 rounded-2xl flex items-center gap-3">
          <Shield size={24} className="text-foreground flex-shrink-0" fill="currentColor" fillOpacity={0.15} />
          <div>
            <div className="text-sm font-bold text-foreground">{available.length} guardians available within 500m</div>
            <div className="text-xs text-muted-foreground">Verified community members ready to help</div>
          </div>
        </div>

        {/* Guardian list */}
        {sampleGuardians.map((g) => {
          const isReq = requested.has(g.id)
          return (
            <div
              key={g.id}
              className={cn(
                'bg-card border rounded-2xl p-4',
                g.available ? 'border-card-border' : 'border-border opacity-60'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{g.name[0]}</span>
                  </div>
                  {g.available && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-secondary border-2 border-card" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{g.name}</span>
                    {g.verified && (
                      <span className="flex items-center gap-0.5 text-xs text-secondary">
                        <CheckCircle size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star size={10} className="text-accent fill-accent" /> {g.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={10} className="text-primary" /> {g.helps} helps
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> {g.distance}m
                    </span>
                  </div>
                  {/* Badges */}
                  {g.badges && g.badges.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {g.badges.map((b) => (
                        <span key={b} className="text-xs px-2 py-0.5 bg-accent/20 text-foreground rounded-full border border-accent/30">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Status */}
                  <span className={cn(
                    'inline-block text-xs px-2 py-0.5 rounded-full mt-2',
                    g.available
                      ? 'bg-secondary/10 text-secondary border border-secondary/20'
                      : 'bg-muted text-muted-foreground border border-border'
                  )}>
                    {g.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {g.available && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => requestHelp(g.id)}
                    disabled={isReq}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all',
                      isReq
                        ? 'bg-secondary/10 border border-secondary text-secondary'
                        : 'bg-primary text-white hover:opacity-90'
                    )}
                  >
                    {isReq ? '✓ Requested' : 'Request Help'}
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-border bg-card text-foreground hover:bg-muted/30 transition-all">
                    View Profile
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {/* Become a guardian */}
        <div className="mt-2 p-4 bg-card border border-card-border rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">
                {isGuardian ? 'You are a Guardian' : 'Become a Guardian'}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isGuardian ? 'Help women in your area stay safe' : 'Join the network and help your community'}
              </div>
            </div>
            <div
              onClick={toggleGuardian}
              className={cn(
                'w-12 h-6 rounded-full border-2 relative cursor-pointer transition-all duration-300',
                isGuardian ? 'bg-secondary border-secondary' : 'bg-muted border-border'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300',
                isGuardian ? 'left-6' : 'left-0.5'
              )} />
            </div>
          </div>
        </div>

        {/* Set availability */}
        <button className="w-full py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted/30 transition-all">
          Set Availability Hours
        </button>
      </div>
    </div>
  )
}
