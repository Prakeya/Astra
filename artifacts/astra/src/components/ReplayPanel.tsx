import type { Journey } from '../data/sampleJourneys'
import { Navigation, CheckCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ReplayPanel({ journeys }: { journeys: Journey[] }) {
  return (
    <div className="flex flex-col gap-2">
      {journeys.map((journey) => (
        <div
          key={journey.id}
          className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50"
        >
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
            journey.status === 'Safe' ? 'bg-secondary/20' :
            journey.status === 'Alert' ? 'bg-yellow-50' :
            'bg-destructive/10'
          )}>
            {journey.status === 'Safe'
              ? <CheckCircle size={16} className="text-secondary" />
              : <AlertTriangle size={16} className="text-yellow-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">
              {journey.from} → {journey.to}
            </div>
            <div className="text-xs text-muted-foreground">{journey.date} · {journey.duration}</div>
            {journey.alerts && journey.alerts.length > 0 && (
              <div className="text-xs text-yellow-600 mt-0.5">{journey.alerts[0]}</div>
            )}
          </div>
          <div className={cn(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            journey.status === 'Safe' ? 'bg-secondary/10 text-secondary' :
            journey.status === 'Alert' ? 'bg-yellow-50 text-yellow-700' :
            'bg-destructive/10 text-destructive'
          )}>
            {journey.status}
          </div>
        </div>
      ))}
    </div>
  )
}
