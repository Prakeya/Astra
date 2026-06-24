import { useLocation } from 'wouter'
import { Shield } from 'lucide-react'

export default function NotFound() {
  const [, navigate] = useLocation()
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <Shield size={48} className="text-primary mb-4" fill="currentColor" fillOpacity={0.15} />
      <h1 className="text-2xl font-black text-foreground mb-2">Page Not Found</h1>
      <p className="text-sm text-muted-foreground mb-6">This route doesn't exist in Astra.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all"
      >
        Go Home
      </button>
    </div>
  )
}
