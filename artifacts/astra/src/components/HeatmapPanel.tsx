import type { Incident } from '../data/sampleIncidents'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  dark_road: 'Dark Road',
  harassment: 'Harassment',
  broken_light: 'Broken Light',
  isolated: 'Isolated',
  suspicious: 'Suspicious',
  other: 'Other',
}

const SEVERITY_DOT: Record<number, string> = {
  1: 'bg-secondary',
  2: 'bg-secondary/70',
  3: 'bg-yellow-400',
  4: 'bg-primary',
  5: 'bg-destructive',
}

export default function HeatmapPanel({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="flex flex-col gap-2">
      {incidents.map((incident) => (
        <div key={incident.id} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
          <span className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', SEVERITY_DOT[incident.severity] || 'bg-muted-foreground')} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{incident.title}</span>
              <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                {TYPE_LABELS[incident.type] || incident.type}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{incident.location} · {incident.time}</div>
          </div>
          <span className={cn(
            'text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0',
            incident.severity >= 4 ? 'bg-destructive/10 text-destructive' :
            incident.severity >= 3 ? 'bg-yellow-50 text-yellow-700' :
            'bg-secondary/10 text-secondary'
          )}>
            S{incident.severity}
          </span>
        </div>
      ))}
    </div>
  )
}
