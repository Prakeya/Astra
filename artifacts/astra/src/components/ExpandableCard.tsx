import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExpandableCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: React.ReactNode
  icon?: React.ReactNode
}

export default function ExpandableCard({
  title,
  subtitle,
  children,
  defaultOpen = false,
  badge,
  icon,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
      <button
        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        {icon && <div className="text-primary flex-shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground text-sm">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {badge}
          <ChevronDown
            size={16}
            className={cn('text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
          />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border/50">
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  )
}
