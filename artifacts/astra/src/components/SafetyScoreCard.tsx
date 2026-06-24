import { cn } from '@/lib/utils'

interface SafetyScoreCardProps {
  score: number
  confidence: number
  riskLevel: 'Low' | 'Moderate' | 'High'
  reasons: string[]
}

const riskConfig = {
  Low: { color: 'text-secondary', bg: 'bg-secondary/10', ring: 'stroke-secondary', label: 'Safe' },
  Moderate: { color: 'text-yellow-600', bg: 'bg-yellow-50', ring: 'stroke-yellow-500', label: 'Moderate' },
  High: { color: 'text-destructive', bg: 'bg-destructive/10', ring: 'stroke-destructive', label: 'High Risk' },
}

export default function SafetyScoreCard({ score, confidence, riskLevel, reasons }: SafetyScoreCardProps) {
  const cfg = riskConfig[riskLevel]
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {/* Circular progress */}
        <div className="relative flex-shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
            <circle cx="44" cy="44" r="36" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
            <circle
              cx="44" cy="44" r="36"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={cn('transition-all duration-700', cfg.ring)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground leading-none">{score}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="flex-1">
          <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2', cfg.bg, cfg.color)}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {cfg.label}
          </div>
          <p className="text-sm text-muted-foreground">
            Confidence: <span className="font-medium text-foreground">{confidence}%</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {riskLevel === 'Low' ? 'Your route looks safe today' :
             riskLevel === 'Moderate' ? 'Exercise some caution on this route' :
             'Take extra precautions on this route'}
          </p>
        </div>
      </div>

      {/* Reasons */}
      <div className="flex flex-col gap-1.5">
        {reasons.map((reason, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
            {reason}
          </div>
        ))}
      </div>
    </div>
  )
}
