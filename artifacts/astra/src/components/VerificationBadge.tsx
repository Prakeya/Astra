import type { VerificationStatus } from '../lib/verification'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'

const STATUS_CONFIG: Record<VerificationStatus, {
  label: string
  className: string
  Icon: React.ElementType
}> = {
  trusted: {
    label: 'TRUSTED',
    className: 'bg-secondary/10 text-secondary border-secondary/20',
    Icon: CheckCircle,
  },
  review: {
    label: 'REVIEW',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Icon: Clock,
  },
  blocked: {
    label: 'BLOCKED',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    Icon: XCircle,
  },
  suspicious: {
    label: 'SUSPICIOUS',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
    Icon: AlertCircle,
  },
  pending: {
    label: 'PENDING',
    className: 'bg-muted text-muted-foreground border-border',
    Icon: Clock,
  },
}

export default function VerificationBadge({ score, status }: { score: number; status: VerificationStatus }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const { Icon } = cfg
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
      cfg.className
    )}>
      <Icon size={12} />
      {cfg.label} · {score}
    </span>
  )
}
