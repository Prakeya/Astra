import { useState } from 'react'
import { Navigation, PhoneCall, Share2, Shield, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ActionPanel() {
  const [tracking, setTracking] = useState(false)
  const [shared, setShared] = useState(false)

  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => setTracking((v) => !v)}
        className={cn(
          'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200',
          tracking
            ? 'bg-secondary/10 border-secondary text-secondary'
            : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
        )}
      >
        <Navigation size={18} strokeWidth={2} />
        <span className="text-xs font-medium">{tracking ? 'Tracking' : 'Track'}</span>
      </button>

      <button
        onClick={() => setShared((v) => !v)}
        className={cn(
          'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200',
          shared
            ? 'bg-accent/20 border-accent text-foreground'
            : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
        )}
      >
        <Share2 size={18} strokeWidth={2} />
        <span className="text-xs font-medium">{shared ? 'Shared' : 'Share'}</span>
      </button>

      <button className="flex flex-col items-center gap-2 p-3 rounded-xl border bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20 transition-all duration-200">
        <PhoneCall size={18} strokeWidth={2} />
        <span className="text-xs font-medium">Escalate</span>
      </button>
    </div>
  )
}
