import { TopBar } from '../components/Navbar'
import MapPanel from '../components/MapPanel'
import HeatmapPanel from '../components/HeatmapPanel'
import { useApp } from '../context/AppContext'
import { useLocation } from 'wouter'
import { Navigation } from 'lucide-react'

export default function MapView() {
  const { incidents } = useApp()
  const [, navigate] = useLocation()

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar
        title="Area Map"
        showBack
        right={
          <span className="text-xs text-muted-foreground">{incidents.length} incidents</span>
        }
      />

      <div className="px-4 pt-4 flex flex-col gap-3">
        <MapPanel className="h-72" showHeatmap showRoute />

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5 p-2 bg-card border border-card-border rounded-xl">
            <div className="w-3 h-3 rounded-full bg-destructive/70 flex-shrink-0" />
            <span className="text-muted-foreground">High risk</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-card border border-card-border rounded-xl">
            <div className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0" />
            <span className="text-muted-foreground">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-card border border-card-border rounded-xl">
            <div className="w-3 h-3 rounded-full bg-secondary flex-shrink-0" />
            <span className="text-muted-foreground">Safe</span>
          </div>
        </div>

        <HeatmapPanel incidents={incidents} />

        <button
          onClick={() => navigate('/walk')}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-bold text-sm shadow-sm hover:opacity-90 transition-all"
        >
          <Navigation size={16} />
          Start Walk from Here
        </button>
      </div>
    </div>
  )
}
