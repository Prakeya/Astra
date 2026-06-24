import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { TopBar } from '../components/Navbar'
import MapPanel from '../components/MapPanel'
import { AlertTriangle, CheckCircle, Shield, Navigation, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const ALERTS = [
  { type: 'warning', text: 'Dark alley ahead in 200m', time: '22:08' },
  { type: 'success', text: 'Rerouted to MG Road', time: '22:09' },
  { type: 'info', text: 'Guardian Ananya is 120m away', time: '22:10' },
]

export default function WalkMode() {
  const [, navigate] = useLocation()
  const [eta, setEta] = useState(12)
  const [status, setStatus] = useState<'walking' | 'safe' | 'sos'>('walking')
  const [guardians] = useState(3)
  const [checkedIn, setCheckedIn] = useState(false)

  useEffect(() => {
    if (status !== 'walking') return
    const interval = setInterval(() => {
      setEta((v) => Math.max(0, v - 1))
    }, 10000)
    return () => clearInterval(interval)
  }, [status])

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <TopBar title="Walk Mode" showBack />

      {/* Status bar */}
      <div className={cn(
        'mx-4 mt-4 p-3 rounded-2xl flex items-center gap-3',
        status === 'walking' ? 'bg-secondary/10 border border-secondary/20' :
        status === 'safe' ? 'bg-secondary/20 border border-secondary' :
        'bg-destructive/10 border border-destructive/20'
      )}>
        <div className={cn(
          'w-3 h-3 rounded-full animate-pulse flex-shrink-0',
          status === 'walking' ? 'bg-secondary' :
          status === 'safe' ? 'bg-secondary' :
          'bg-destructive'
        )} />
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">
            {status === 'walking' ? 'Walking safely' :
             status === 'safe' ? 'Marked safe' :
             'SOS Active'}
          </div>
          <div className="text-xs text-muted-foreground">ETA: {eta} min · {guardians} guardians watching</div>
        </div>
        <Shield size={18} className={status === 'walking' ? 'text-secondary' : status === 'safe' ? 'text-secondary' : 'text-destructive'} />
      </div>

      {/* Map */}
      <div className="mx-4 mt-3">
        <MapPanel className="h-64" showRoute showHeatmap />
      </div>

      {/* Info chips */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        <div className="bg-card border border-card-border rounded-xl p-2.5 text-center">
          <div className="text-lg font-bold text-foreground">{eta}</div>
          <div className="text-xs text-muted-foreground">min ETA</div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-2.5 text-center">
          <div className="text-lg font-bold text-foreground">{guardians}</div>
          <div className="text-xs text-muted-foreground">guardians</div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-2.5 text-center">
          <div className="text-lg font-bold text-secondary">Safe</div>
          <div className="text-xs text-muted-foreground">route</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => setCheckedIn(true)}
          className={cn(
            'py-3 rounded-2xl text-sm font-semibold border transition-all',
            checkedIn
              ? 'bg-secondary/10 border-secondary text-secondary'
              : 'bg-card border-card-border text-foreground hover:bg-muted/30'
          )}
        >
          {checkedIn ? '✓ Checked In' : 'Check In'}
        </button>
        <button
          onClick={() => { setStatus('safe'); navigate('/safe-now') }}
          className="py-3 rounded-2xl text-sm font-semibold bg-secondary text-white border border-secondary hover:opacity-90 transition-all"
        >
          I'm Safe
        </button>
        <button
          onClick={() => { setStatus('sos'); navigate('/sos') }}
          className="py-3 rounded-2xl text-sm font-bold bg-destructive text-white border border-destructive hover:opacity-90 transition-all"
        >
          SOS
        </button>
      </div>

      {/* Alerts feed */}
      <div className="mx-4 mt-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recent Alerts</div>
        <div className="flex flex-col gap-2">
          {ALERTS.map((alert, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2 p-3 rounded-xl',
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                alert.type === 'success' ? 'bg-secondary/10 border border-secondary/20' :
                'bg-card border border-card-border'
              )}
            >
              {alert.type === 'warning'
                ? <AlertTriangle size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                : alert.type === 'success'
                ? <CheckCircle size={14} className="text-secondary mt-0.5 flex-shrink-0" />
                : <Navigation size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />}
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{alert.text}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call button */}
      <div className="mx-4 mt-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted/30 transition-all">
          <Phone size={16} />
          Call Trusted Contact
        </button>
      </div>
    </div>
  )
}
