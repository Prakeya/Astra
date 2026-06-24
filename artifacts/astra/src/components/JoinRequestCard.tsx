import { useMemo, useState } from 'react'
import VerificationBadge from './VerificationBadge'
import { scoreJoinRequest } from '../lib/verification'
import { cn } from '@/lib/utils'

export default function JoinRequestCard() {
  const [form, setForm] = useState({
    verified: false,
    trustedContacts: 0,
    deviceKnown: false,
    hostApproved: false,
    recentJoins: 0,
    profileComplete: false,
    locationMatch: false,
    repeatedAttempts: 0,
  })

  const result = useMemo(() => scoreJoinRequest({
    verified: form.verified,
    trustedContacts: Number(form.trustedContacts),
    deviceKnown: form.deviceKnown,
    hostApproved: form.hostApproved,
    recentJoins: Number(form.recentJoins),
    profileComplete: form.profileComplete,
    locationMatch: form.locationMatch,
    repeatedAttempts: Number(form.repeatedAttempts),
  }), [form])

  const toggle = (key: keyof typeof form) => setForm({ ...form, [key]: !form[key] })
  const setNum = (key: keyof typeof form, val: string) => setForm({ ...form, [key]: val })

  const checkboxes = [
    { key: 'verified' as const, label: 'Account verified' },
    { key: 'deviceKnown' as const, label: 'Known device' },
    { key: 'hostApproved' as const, label: 'Host approved' },
    { key: 'profileComplete' as const, label: 'Profile complete' },
    { key: 'locationMatch' as const, label: 'Location matches' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {checkboxes.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <div
              className={cn(
                'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                form[key] ? 'bg-primary border-primary' : 'border-border bg-background'
              )}
              onClick={() => toggle(key)}
            >
              {form[key] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>}
            </div>
            <span className="text-xs text-foreground">{label}</span>
          </label>
        ))}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Trusted contacts</span>
          <input
            type="number"
            min="0"
            value={form.trustedContacts}
            onChange={(e) => setNum('trustedContacts', e.target.value)}
            className="w-full h-8 px-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Repeated attempts</span>
          <input
            type="number"
            min="0"
            value={form.repeatedAttempts}
            onChange={(e) => setNum('repeatedAttempts', e.target.value)}
            className="w-full h-8 px-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>
      </div>

      {/* Result */}
      <div className="p-3 bg-muted/30 rounded-xl border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-foreground">Verification Result</span>
          <VerificationBadge score={result.score} status={result.status} />
        </div>
        {/* Score bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-500 bg-primary"
            style={{ width: `${result.score}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {result.reasons.slice(0, 4).map((r, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-background border border-border rounded text-muted-foreground">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
