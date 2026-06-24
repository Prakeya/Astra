import { TopBar } from '../components/Navbar'
import { useApp } from '../context/AppContext'
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  dark_road: 'Dark Road',
  harassment: 'Harassment',
  broken_light: 'Broken Light',
  isolated: 'Isolated',
  suspicious: 'Suspicious',
  other: 'Other',
}

export default function History() {
  const { incidents, deleteIncident } = useApp()

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Incident History" showBack />

      <div className="px-4 pt-4 flex flex-col gap-3">
        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle size={40} className="text-secondary mb-3" />
            <p className="text-base font-semibold text-foreground">No incidents reported</p>
            <p className="text-sm text-muted-foreground mt-1">Your area is looking safe!</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-card border border-card-border rounded-2xl p-4 flex items-start gap-3"
            >
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                incident.severity >= 4 ? 'bg-destructive/10' : 'bg-yellow-50'
              )}>
                <AlertTriangle
                  size={16}
                  className={incident.severity >= 4 ? 'text-destructive' : 'text-yellow-600'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{incident.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{incident.location} · {incident.time}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                        {TYPE_LABELS[incident.type] || incident.type}
                      </span>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded font-semibold',
                        incident.severity >= 4 ? 'bg-destructive/10 text-destructive' :
                        incident.severity >= 3 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-secondary/10 text-secondary'
                      )}>
                        Severity {incident.severity}
                      </span>
                      {incident.verified && (
                        <span className="text-xs text-secondary flex items-center gap-0.5">
                          <CheckCircle size={10} /> Verified
                        </span>
                      )}
                    </div>
                    {incident.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{incident.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteIncident(incident.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
