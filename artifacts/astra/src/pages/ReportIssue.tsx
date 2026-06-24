import { useState } from 'react'
import { useLocation } from 'wouter'
import { TopBar } from '../components/Navbar'
import { useApp } from '../context/AppContext'
import type { IncidentType, Incident } from '../data/sampleIncidents'
import { Camera, Mic, FileText, MapPin, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES: { value: IncidentType; label: string; emoji: string }[] = [
  { value: 'dark_road', label: 'Dark road', emoji: '🌑' },
  { value: 'harassment', label: 'Harassment', emoji: '⚠️' },
  { value: 'broken_light', label: 'Broken light', emoji: '💡' },
  { value: 'isolated', label: 'Isolated', emoji: '🚶' },
  { value: 'suspicious', label: 'Suspicious', emoji: '👁️' },
  { value: 'other', label: 'Other', emoji: '📍' },
]

export default function ReportIssue() {
  const { addIncident, incidents } = useApp()
  const [, navigate] = useLocation()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    type: '' as IncidentType | '',
    description: '',
    location: 'MG Road, Bangalore (auto-detected)',
    anonymous: true,
    severity: 3,
    hasPhoto: false,
    hasVoice: false,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.type) return

    const newIncident: Incident = {
      id: Date.now(),
      title: CATEGORIES.find((c) => c.value === form.type)?.label || 'Incident',
      location: form.location,
      severity: form.severity,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      type: form.type as IncidentType,
      description: form.description,
      anonymous: form.anonymous,
      verified: false,
      reportedAt: new Date().toISOString(),
    }
    addIncident(newIncident)
    setSubmitted(true)
    setTimeout(() => navigate('/dashboard'), 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-secondary" />
        </div>
        <h2 className="text-xl font-black text-foreground mb-2">Report Submitted</h2>
        <p className="text-sm text-muted-foreground mb-1">Your report helps keep the community safe.</p>
        <p className="text-xs text-primary font-semibold">+5 trust score points</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Report Unsafe Area" showBack />

      <form onSubmit={submit} className="px-4 pt-4 flex flex-col gap-4">
        {/* Media upload */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, hasPhoto: !form.hasPhoto })}
            className={cn(
              'flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border text-sm font-medium transition-all',
              form.hasPhoto
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-card-border text-muted-foreground hover:bg-muted/30'
            )}
          >
            <Camera size={20} />
            <span>{form.hasPhoto ? 'Photo added' : 'Add Photo'}</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, hasVoice: !form.hasVoice })}
            className={cn(
              'flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border text-sm font-medium transition-all',
              form.hasVoice
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-card-border text-muted-foreground hover:bg-muted/30'
            )}
          >
            <Mic size={20} />
            <span>{form.hasVoice ? 'Voice added' : 'Voice Note'}</span>
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-2">
            <FileText size={12} /> Description
          </label>
          <textarea
            rows={3}
            placeholder="Describe what you observed..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setForm({ ...form, type: cat.value })}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all',
                  form.type === cat.value
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card border-card-border text-foreground hover:bg-muted/30'
                )}
              >
                <span className="text-lg">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Severity: {form.severity}/5
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, severity: s })}
                className={cn(
                  'flex-1 h-8 rounded-lg border text-xs font-bold transition-all',
                  form.severity >= s
                    ? s >= 4 ? 'bg-destructive border-destructive text-white' :
                      s >= 3 ? 'bg-yellow-400 border-yellow-400 text-white' :
                      'bg-secondary border-secondary text-white'
                    : 'bg-card border-card-border text-muted-foreground'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Location & time */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 p-3 bg-card border border-card-border rounded-xl">
            <MapPin size={16} className="text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">Location</div>
              <div className="text-sm text-foreground truncate">{form.location}</div>
            </div>
            <span className="text-xs text-primary font-medium">Auto</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-card border border-card-border rounded-xl">
            <Clock size={16} className="text-muted-foreground flex-shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">Time</div>
              <div className="text-sm text-foreground">Now</div>
            </div>
          </div>
        </div>

        {/* Anonymous toggle */}
        <div
          className="flex items-center justify-between p-3 bg-card border border-card-border rounded-xl cursor-pointer"
          onClick={() => setForm({ ...form, anonymous: !form.anonymous })}
        >
          <div>
            <div className="text-sm font-medium text-foreground">Report Anonymously</div>
            <div className="text-xs text-muted-foreground">Your identity won't be shared</div>
          </div>
          <div className={cn(
            'w-11 h-6 rounded-full border-2 relative transition-all duration-200',
            form.anonymous ? 'bg-secondary border-secondary' : 'bg-muted border-border'
          )}>
            <div className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
              form.anonymous ? 'left-5' : 'left-0.5'
            )} />
          </div>
        </div>

        {/* Trust score note */}
        <div className="p-3 bg-accent/20 border border-accent/40 rounded-xl text-center">
          <p className="text-xs text-foreground font-medium">Trust score impact: <span className="text-secondary font-bold">+5 verified points</span></p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!form.type}
          className={cn(
            'w-full py-4 rounded-2xl font-bold text-base transition-all',
            form.type
              ? 'bg-primary text-white shadow-sm hover:opacity-90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          Submit Report
        </button>
      </form>
    </div>
  )
}
