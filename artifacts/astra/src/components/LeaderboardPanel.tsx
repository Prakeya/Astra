import type { Guardian } from '../data/sampleGuardians'
import { Shield, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LeaderboardPanel({ guardians }: { guardians: Guardian[] }) {
  const sorted = [...guardians].sort((a, b) => (b.helps || 0) - (a.helps || 0))

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((g, i) => (
        <div key={g.id} className="flex items-center gap-3 py-2">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
            i === 0 ? 'bg-accent text-foreground' :
            i === 1 ? 'bg-muted text-foreground' :
            i === 2 ? 'bg-orange-100 text-orange-700' :
            'bg-muted/50 text-muted-foreground'
          )}>
            {i + 1}
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-secondary">{g.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{g.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star size={10} className="text-accent fill-accent" />
              {g.rating}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Shield size={12} />
            {g.helps} helps
          </div>
        </div>
      ))}
    </div>
  )
}
