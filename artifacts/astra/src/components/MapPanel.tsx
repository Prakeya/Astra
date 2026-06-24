import { cn } from '@/lib/utils'

interface MapDot {
  x: number
  y: number
  type: 'user' | 'guardian' | 'incident' | 'destination'
  label?: string
}

interface MapPanelProps {
  className?: string
  dots?: MapDot[]
  showRoute?: boolean
  showHeatmap?: boolean
}

const defaultDots: MapDot[] = [
  { x: 50, y: 60, type: 'user', label: 'You' },
  { x: 35, y: 45, type: 'guardian', label: 'Ananya' },
  { x: 65, y: 40, type: 'guardian', label: 'Rahul' },
  { x: 55, y: 30, type: 'guardian', label: 'Meera' },
  { x: 30, y: 70, type: 'incident' },
  { x: 70, y: 65, type: 'incident' },
  { x: 50, y: 20, type: 'destination', label: 'Home' },
]

export default function MapPanel({ className, dots = defaultDots, showRoute = true, showHeatmap = true }: MapPanelProps) {
  return (
    <div className={cn('relative w-full rounded-xl overflow-hidden bg-[#e8e0d5]', className)} style={{ minHeight: 220 }}>
      {/* Map background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[10,20,30,40,50,60,70,80,90].map(v => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="#3D405B" strokeWidth="0.3" />
            <line x1="0" y1={v} x2="100" y2={v} stroke="#3D405B" strokeWidth="0.3" />
          </g>
        ))}
        {/* Roads */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="#3D405B" strokeWidth="1.5" opacity="0.5" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#3D405B" strokeWidth="1.5" opacity="0.5" />
        <line x1="0" y1="30" x2="100" y2="30" stroke="#3D405B" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="70" x2="100" y2="70" stroke="#3D405B" strokeWidth="1" opacity="0.3" />
        <line x1="30" y1="0" x2="30" y2="100" stroke="#3D405B" strokeWidth="1" opacity="0.3" />
        <line x1="70" y1="0" x2="70" y2="100" stroke="#3D405B" strokeWidth="1" opacity="0.3" />
        {/* Block fills */}
        <rect x="10" y="10" width="18" height="12" fill="#3D405B" opacity="0.08" rx="1" />
        <rect x="55" y="10" width="14" height="16" fill="#3D405B" opacity="0.08" rx="1" />
        <rect x="10" y="35" width="16" height="10" fill="#3D405B" opacity="0.08" rx="1" />
        <rect x="72" y="35" width="18" height="12" fill="#3D405B" opacity="0.08" rx="1" />
        <rect x="55" y="55" width="12" height="10" fill="#3D405B" opacity="0.08" rx="1" />
        <rect x="10" y="55" width="16" height="12" fill="#3D405B" opacity="0.08" rx="1" />
        <rect x="72" y="55" width="16" height="12" fill="#3D405B" opacity="0.08" rx="1" />
        <rect x="35" y="72" width="12" height="15" fill="#3D405B" opacity="0.08" rx="1" />
        <rect x="55" y="72" width="12" height="15" fill="#3D405B" opacity="0.08" rx="1" />
      </svg>

      {/* Heatmap blobs */}
      {showHeatmap && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="heat1" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#E07A5F" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heat2" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#E07A5F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="30" cy="70" rx="12" ry="10" fill="url(#heat1)" />
          <ellipse cx="70" cy="65" rx="10" ry="8" fill="url(#heat2)" />
        </svg>
      )}

      {/* Safe route line */}
      {showRoute && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points="50,60 50,50 50,20"
            fill="none"
            stroke="#81B29A"
            strokeWidth="2"
            strokeDasharray="4,2"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Dots */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {dots.map((dot, i) => {
          if (dot.type === 'user') {
            return (
              <g key={i}>
                <circle cx={dot.x} cy={dot.y} r="5" fill="#E07A5F" opacity="0.25" />
                <circle cx={dot.x} cy={dot.y} r="3" fill="#E07A5F" />
                <circle cx={dot.x} cy={dot.y} r="1.5" fill="white" />
              </g>
            )
          }
          if (dot.type === 'guardian') {
            return (
              <g key={i}>
                <circle cx={dot.x} cy={dot.y} r="4" fill="#F2CC8F" opacity="0.3" />
                <circle cx={dot.x} cy={dot.y} r="2.5" fill="#F2CC8F" />
              </g>
            )
          }
          if (dot.type === 'incident') {
            return (
              <g key={i}>
                <circle cx={dot.x} cy={dot.y} r="3" fill="#E07A5F" opacity="0.5" />
                <line x1={dot.x} y1={dot.y - 3} x2={dot.x} y2={dot.y + 3} stroke="#E07A5F" strokeWidth="1" />
                <line x1={dot.x - 3} y1={dot.y} x2={dot.x + 3} y2={dot.y} stroke="#E07A5F" strokeWidth="1" />
              </g>
            )
          }
          if (dot.type === 'destination') {
            return (
              <g key={i}>
                <circle cx={dot.x} cy={dot.y} r="4" fill="#81B29A" />
                <circle cx={dot.x} cy={dot.y} r="2" fill="white" />
              </g>
            )
          }
          return null
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1">
        <span className="flex items-center gap-1 text-[10px] text-foreground/70">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" /> You
        </span>
        <span className="flex items-center gap-1 text-[10px] text-foreground/70">
          <span className="w-2 h-2 rounded-full bg-accent inline-block" /> Guardians
        </span>
        <span className="flex items-center gap-1 text-[10px] text-foreground/70">
          <span className="w-2 h-2 rounded-full bg-secondary inline-block" /> Safe route
        </span>
      </div>

      {/* Location label */}
      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] font-medium text-foreground/70">
        MG Road, Bangalore
      </div>
    </div>
  )
}
