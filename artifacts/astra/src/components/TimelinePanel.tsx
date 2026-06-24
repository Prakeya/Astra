import type { Journey } from '../data/sampleJourneys'
import { cn } from '@/lib/utils'

export default function TimelinePanel({ items }: { items: Journey[] }) {
  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />

      {items.map((item, index) => (
        <div key={item.id} className="relative flex flex-col gap-0.5 pb-4 last:pb-0">
          {/* Dot */}
          <div className={cn(
            'absolute -left-4 top-1 w-3 h-3 rounded-full border-2 border-background',
            item.status === 'Safe' ? 'bg-secondary' :
            item.status === 'Alert' ? 'bg-yellow-400' :
            'bg-destructive'
          )} />
          <div className="text-sm font-medium text-foreground">
            {item.from} → {item.to}
          </div>
          <div className="text-xs text-muted-foreground">
            {item.date} · {item.duration}
          </div>
        </div>
      ))}
    </div>
  )
}
