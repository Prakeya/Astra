import { TopBar } from '../components/Navbar'
import { useApp } from '../context/AppContext'
import { Bell, AlertTriangle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_ALERTS = [
  { id: 1, type: 'incident', text: 'New incident reported near MG Road (300m)', time: '22:05', severity: 'high' },
  { id: 2, type: 'guardian', text: 'Guardian Ananya started watching your route', time: '21:58', severity: 'info' },
  { id: 3, type: 'system', text: 'Safe check-in confirmed for Priya', time: '21:45', severity: 'safe' },
  { id: 4, type: 'incident', text: 'Suspicious activity reported in Koramangala', time: '21:30', severity: 'medium' },
]

export default function Alerts() {
  const { user, alertsEnabled, emergencyEnabled, setAlertsEnabled, setEmergencyEnabled } = useApp()

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      className={cn(
        'w-12 h-6 rounded-full border-2 relative cursor-pointer transition-all duration-200 flex-shrink-0',
        checked ? 'bg-secondary border-secondary' : 'bg-muted border-border'
      )}
    >
      <div className={cn(
        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
        checked ? 'left-6' : 'left-0.5'
      )} />
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Alerts & Emergency" showBack />

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Alert controls */}
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Alert Settings</div>
          </div>
          <div className="flex flex-col divide-y divide-border">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-start gap-3">
                <Bell size={16} className="text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-foreground">Contact alerts</div>
                  <div className="text-xs text-muted-foreground">Notify trusted contacts of incidents</div>
                </div>
              </div>
              <Toggle checked={alertsEnabled} onChange={() => setAlertsEnabled(!alertsEnabled)} />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-destructive mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-foreground">Emergency escalation</div>
                  <div className="text-xs text-muted-foreground">Auto-escalate to police & guardians</div>
                </div>
              </div>
              <Toggle checked={emergencyEnabled} onChange={() => setEmergencyEnabled(!emergencyEnabled)} />
            </div>
          </div>
        </div>

        {/* Status summary */}
        <div className={cn(
          'p-4 rounded-2xl border',
          alertsEnabled && emergencyEnabled
            ? 'bg-secondary/10 border-secondary/20'
            : 'bg-yellow-50 border-yellow-200'
        )}>
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full animate-pulse', alertsEnabled ? 'bg-secondary' : 'bg-yellow-400')} />
            <span className="text-sm font-semibold text-foreground">
              {alertsEnabled && emergencyEnabled
                ? 'Full protection active'
                : alertsEnabled
                ? 'Contact alerts only'
                : 'Alerts paused'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Trusted contacts: <span className="font-medium text-foreground">{user.trustedContacts.length}</span> · 
            {' '}{alertsEnabled ? 'Alerting active.' : 'Alerting is off.'}
          </p>
        </div>

        {/* Recent alerts */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Recent Alerts</div>
          <div className="flex flex-col gap-2">
            {MOCK_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border',
                  alert.severity === 'high' ? 'bg-destructive/5 border-destructive/20' :
                  alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  alert.severity === 'safe' ? 'bg-secondary/10 border-secondary/20' :
                  'bg-card border-card-border'
                )}
              >
                <div className={cn(
                  'mt-0.5 flex-shrink-0',
                  alert.severity === 'high' ? 'text-destructive' :
                  alert.severity === 'medium' ? 'text-yellow-600' :
                  'text-secondary'
                )}>
                  <AlertTriangle size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{alert.text}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
