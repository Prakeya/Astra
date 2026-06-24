import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { PhoneCall, Shield, AlertCircle } from 'lucide-react'
import MapPanel from '../components/MapPanel'
import { cn } from '@/lib/utils'

const RESPONDERS = [
  { id: 'r1', name: 'Ananya F.', distance: 80, eta: 2, status: 'arriving', action: 'On the way' },
  { id: 'r2', name: 'Rahul K.', distance: 120, eta: 3, status: 'called_police', action: 'Called police' },
  { id: 'r3', name: 'Meera S.', distance: 150, eta: 4, status: 'on_call', action: 'On call with you' },
]

const STATUS_CONFIG = {
  arriving: { label: 'Arriving', color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20', emoji: '⏱️' },
  called_police: { label: 'Called Police', color: 'text-primary', bg: 'bg-primary/10 border-primary/20', emoji: '📞' },
  on_call: { label: 'On Line', color: 'text-accent-foreground', bg: 'bg-accent/20 border-accent/40', emoji: '☎️' },
}

export default function SOS() {
  const [, navigate] = useLocation()
  const [responded, setResponded] = useState(1)
  const [alarmActive, setAlarmActive] = useState(true)
  const [flashActive, setFlashActive] = useState(true)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((v) => v + 1)
      if (responded < RESPONDERS.length) {
        setResponded((v) => Math.min(v + 1, RESPONDERS.length))
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [responded])

  return (
    <div className="min-h-screen bg-destructive/5 flex flex-col pb-6">
      {/* Emergency header */}
      <div className="bg-destructive px-4 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <AlertCircle size={22} />
          </div>
          <div className="flex-1">
            <div className="font-black text-xl tracking-tight">EMERGENCY ACTIVE</div>
            <div className="text-sm opacity-80">Alerting guardians... {elapsed}s elapsed</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="opacity-80">Guardians responded</span>
            <span className="font-bold">{responded}/{RESPONDERS.length}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${(responded / RESPONDERS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Responders list */}
        <div className="flex flex-col gap-2">
          {RESPONDERS.slice(0, responded).map((r) => {
            const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG]
            return (
              <div
                key={r.id}
                className={cn(
                  'flex items-center gap-3 p-3 bg-card rounded-2xl border',
                  cfg.bg
                )}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{r.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.distance}m away · arriving in {r.eta} min
                  </div>
                </div>
                <div className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full', cfg.bg, cfg.color)}>
                  <span>{cfg.emoji}</span>
                  <span>{r.action}</span>
                </div>
              </div>
            )
          })}
          {responded < RESPONDERS.length && (
            <div className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border opacity-50">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0 animate-pulse">
                <Shield size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-muted-foreground">Alerting more guardians...</div>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <MapPanel className="h-44" />

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-1.5 p-3 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary">
            <PhoneCall size={18} />
            <span className="text-xs font-semibold">Call Closest</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 p-3 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive">
            <PhoneCall size={18} />
            <span className="text-xs font-semibold">Call Police</span>
          </button>
          <button
            onClick={() => navigate('/safe-now')}
            className="flex flex-col items-center gap-1.5 p-3 bg-secondary text-white rounded-2xl"
          >
            <Shield size={18} />
            <span className="text-xs font-bold">Safe Now</span>
          </button>
        </div>

        {/* Deterrents */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setAlarmActive((v) => !v)}
            className={cn(
              'flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all',
              alarmActive ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-card border-border text-muted-foreground'
            )}
          >
            <span className="text-base">🔊</span>
            <span>{alarmActive ? 'Alarm Active' : 'Alarm Off'}</span>
          </button>
          <button
            onClick={() => setFlashActive((v) => !v)}
            className={cn(
              'flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all',
              flashActive ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-card border-border text-muted-foreground'
            )}
          >
            <span className="text-base">💡</span>
            <span>{flashActive ? 'Flash Active' : 'Flash Off'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
