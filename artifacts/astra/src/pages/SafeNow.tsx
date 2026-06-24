import { useLocation } from 'wouter'
import { Star, Share2, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const GUARDIANS_WHO_HELPED = [
  { name: 'Ananya F.', action: 'arrived in 2 min', avatar: 'A' },
  { name: 'Rahul K.', action: 'called police', avatar: 'R' },
  { name: 'Meera S.', action: 'stayed on line', avatar: 'M' },
]

export default function SafeNow() {
  const [, navigate] = useLocation()
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [shared, setShared] = useState(false)

  const setRating = (name: string, r: number) => setRatings((prev) => ({ ...prev, [name]: r }))

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 pb-8">
      {/* Hero */}
      <div className="w-full pt-12 pb-8 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center">
            <CheckCircle size={48} className="text-secondary" />
          </div>
          <div className="absolute -top-1 -right-1 text-2xl animate-bounce">✨</div>
        </div>
        <h1 className="text-3xl font-black text-foreground mb-2">YOU ARE SAFE</h1>
        <p className="text-muted-foreground text-sm max-w-xs">
          You made it. Your guardians responded and kept you protected.
        </p>
      </div>

      {/* Thank you list */}
      <div className="w-full max-w-sm bg-card rounded-3xl border border-card-border p-5 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Thank you</p>
        <div className="flex flex-col gap-4">
          {GUARDIANS_WHO_HELPED.map((g) => (
            <div key={g.name} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">{g.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">{g.name}</div>
                <div className="text-xs text-secondary">🙏 {g.action}</div>
              </div>
              {/* Star rating */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(g.name, star)}>
                    <Star
                      size={14}
                      className={cn(
                        'transition-colors',
                        (ratings[g.name] || 0) >= star ? 'text-accent fill-accent' : 'text-muted-foreground'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Message */}
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            "Glad you're safe! 💙"
          </p>
        </div>
      </div>

      {/* Community impact */}
      <div className="w-full max-w-sm bg-foreground text-background rounded-3xl p-5 mb-6 text-center">
        <div className="text-3xl font-black mb-1">47</div>
        <p className="text-sm opacity-80">guardians kept</p>
        <div className="text-3xl font-black mt-2 mb-1">203</div>
        <p className="text-sm opacity-80">women safe this week</p>
        <div className="mt-3 pt-3 border-t border-white/20 text-sm font-semibold opacity-90">
          You're one of them 💪
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={() => setShared(true)}
          className={cn(
            'flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm transition-all',
            shared
              ? 'bg-secondary/10 border border-secondary text-secondary'
              : 'bg-foreground text-background hover:opacity-90'
          )}
        >
          <Share2 size={16} />
          {shared ? 'Story Shared!' : 'Share Story'}
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 rounded-2xl font-bold text-sm bg-card border border-card-border text-foreground hover:bg-muted/30 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  )
}
