import { useApp } from '../context/AppContext'
import { TopBar } from '../components/Navbar'
import ExpandableCard from '../components/ExpandableCard'
import ActionPanel from '../components/ActionPanel'
import HeatmapPanel from '../components/HeatmapPanel'
import ReplayPanel from '../components/ReplayPanel'
import StatsPanel from '../components/StatsPanel'
import LeaderboardPanel from '../components/LeaderboardPanel'
import TimelinePanel from '../components/TimelinePanel'
import SeverityChart from '../components/SeverityChart'
import JoinRequestCard from '../components/JoinRequestCard'
import MapPanel from '../components/MapPanel'
import sampleGuardians from '../data/sampleGuardians'
import sampleJourneys from '../data/sampleJourneys'
import { guardianAgent } from '../agents/guardianAgent'
import { predictionAgent } from '../agents/predictionAgent'
import { trustAgent } from '../agents/trustAgent'
import companionAgent from '../agents/companionAgent'
import { emergencyAgent } from '../agents/emergencyAgent'
import { municipalityAgent } from '../agents/municipalityAgent'
import { routeAgent } from '../agents/routeAgent'
import { alertAgent } from '../agents/alertAgent'
import { helpPointAgent } from '../agents/helpPointAgent'
import { useLocation } from 'wouter'
import {
  Shield, Navigation, AlertCircle, Users,
  BarChart2, Map, Activity, Building2, CheckSquare, Clock, Zap, Brain, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const { user, incidents, alertsEnabled, emergencyEnabled } = useApp()
  const [, navigate] = useLocation()

  const context = {
    reports: incidents,
    historicalIncidents: incidents,
    timeOfDay: 22,
    dayOfWeek: 'Friday',
    weather: 'fog',
    crowdDensity: 0.2,
    trustScores: [92, 88, 80],
    route: [{ title: 'MG Road', type: 'poor lighting', tags: ['lighting'] }],
    trustedContacts: user.trustedContacts.map((c) => c.name),
    guardians: sampleGuardians,
    minutesToHome: 7,
    riskLevel: 'High' as const,
  }

  const routes = [
    { name: 'Route A', riskScore: 68 },
    { name: 'Route B', riskScore: 42 },
    { name: 'Route C', riskScore: 55 },
  ]

  const helpPoints = [
    { name: 'Police Station', distanceKm: 0.8 },
    { name: 'Hospital', distanceKm: 1.2 },
    { name: 'Women Help Center', distanceKm: 0.6 },
  ]

  const prediction = predictionAgent(context)
  const trust = trustAgent({ user, incidents })
  const guardian = guardianAgent(context)
  const chosenRoute = routeAgent(routes)
  const companionText = companionAgent({ minutesToHome: 7, riskLevel: guardian.riskLevel })
  const emergency = emergencyAgent({ riskLevel: guardian.riskLevel, trustedContacts: user.trustedContacts.map((c) => c.name) })
  const municipality = municipalityAgent(trust.clustered[0])
  const nearestHelpPoint = helpPointAgent(helpPoints)
  const alertMessage = alertAgent({ riskLevel: guardian.riskLevel, alertsEnabled, emergencyEnabled })

  const highRiskCount = incidents.filter((i) => i.severity >= 4).length
  const stats = [
    { label: 'Safe Walks', value: '1,842' },
    { label: 'High-Risk Areas', value: String(highRiskCount) },
    { label: 'Active Guardians', value: '417' },
    { label: 'Safe Arrivals', value: '96%' },
    { label: 'Infrastructure Issues', value: String(incidents.length) },
    { label: 'Women Helped', value: String(user.womenHelped) },
  ]

  const riskColor =
    guardian.riskLevel === 'Low' ? 'bg-secondary/10 text-secondary border-secondary/20' :
    guardian.riskLevel === 'Moderate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
    'bg-destructive/10 text-destructive border-destructive/20'

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar
        title="Astra"
        right={
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Hi, {user.name.split(' ')[0]}</span>
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{user.name[0]}</span>
            </div>
          </div>
        }
      />

      <div className="px-4 pt-4 flex flex-col gap-3">
        {/* Safety Score Banner */}
        <div className={cn('p-4 rounded-2xl border flex items-center gap-3', riskColor)}>
          <div className="text-3xl font-black">{guardian.score}</div>
          <div>
            <div className="font-semibold text-sm">Safety Score</div>
            <div className="text-xs opacity-80">
              {guardian.riskLevel === 'Low' ? 'Your route looks safe today' :
               guardian.riskLevel === 'Moderate' ? 'Exercise some caution today' :
               'Take extra precautions today'}
            </div>
          </div>
          <div className="ml-auto">
            <Shield size={28} fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>

        {/* Map */}
        <MapPanel className="h-48" showHeatmap showRoute />

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigate('/walk')}
            className="flex flex-col items-center gap-2 p-3 bg-primary text-white rounded-2xl shadow-sm"
          >
            <Navigation size={20} />
            <span className="text-xs font-bold">Start Walk</span>
          </button>
          <button
            onClick={() => navigate('/report')}
            className="flex flex-col items-center gap-2 p-3 bg-card border border-card-border rounded-2xl"
          >
            <AlertCircle size={20} className="text-primary" />
            <span className="text-xs font-semibold text-foreground">Report Issue</span>
          </button>
          <button
            onClick={() => navigate('/guardians')}
            className="flex flex-col items-center gap-2 p-3 bg-card border border-card-border rounded-2xl"
          >
            <Users size={20} className="text-secondary" />
            <span className="text-xs font-semibold text-foreground">Guardians</span>
          </button>
        </div>

        {/* Expandable dashboard cards */}
        <ExpandableCard
          title="Join Verification"
          subtitle="Check trust score for new join requests"
          icon={<CheckSquare size={16} />}
        >
          <JoinRequestCard />
        </ExpandableCard>

        <ExpandableCard
          title="Live Map"
          subtitle={`${incidents.length} incidents · ${sampleGuardians.length} guardians nearby`}
          icon={<Map size={16} />}
        >
          <MapPanel className="h-48" />
        </ExpandableCard>

        <ExpandableCard
          title="Safety Replay"
          subtitle="Your recent journey history"
          icon={<Clock size={16} />}
        >
          <ReplayPanel journeys={sampleJourneys} />
        </ExpandableCard>

        <ExpandableCard
          title="Safety Timeline"
          subtitle="Recent route activity"
          icon={<Activity size={16} />}
        >
          <TimelinePanel items={sampleJourneys} />
        </ExpandableCard>

        <ExpandableCard
          title="Community Impact"
          subtitle="App-wide safety statistics"
          icon={<BarChart2 size={16} />}
        >
          <StatsPanel stats={stats} />
        </ExpandableCard>

        <ExpandableCard
          title="Guardian Leaderboard"
          subtitle="Top helpers in your community"
          icon={<Users size={16} />}
          badge={<span className="text-xs bg-accent/20 text-foreground px-2 py-0.5 rounded-full font-medium">🏆</span>}
        >
          <LeaderboardPanel guardians={sampleGuardians} />
        </ExpandableCard>

        <ExpandableCard
          title="Prediction Agent"
          subtitle={prediction.note}
          icon={<Brain size={16} />}
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="text-foreground font-medium mb-1">Route Risk</p>
              <p className="text-muted-foreground text-xs">{prediction.note}</p>
              {prediction.proactiveWarning && (
                <p className="text-yellow-600 text-xs mt-2 font-medium">⚠️ {prediction.proactiveWarning}</p>
              )}
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="text-foreground font-medium mb-1">Companion Message</p>
              <p className="text-muted-foreground text-xs">{companionText}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="text-foreground font-medium mb-1">Best Route</p>
              <p className="text-muted-foreground text-xs">{chosenRoute?.name} (risk score: {chosenRoute?.riskScore})</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="text-foreground font-medium mb-1">Nearest Help Point</p>
              <p className="text-muted-foreground text-xs">{nearestHelpPoint?.name} — {nearestHelpPoint?.distanceKm} km</p>
            </div>
          </div>
        </ExpandableCard>

        <ExpandableCard
          title="Trust Agent"
          subtitle={`User trust score: ${trust.trustScore}`}
          icon={<Shield size={16} />}
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground text-xs">Trust Score</span>
              <span className="font-bold text-foreground">{trust.trustScore}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground text-xs">Clustered Incidents</span>
              <span className="font-bold text-foreground">{trust.clustered.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground text-xs">Weighted Incidents</span>
              <span className="font-bold text-foreground">{trust.weighted.length}</span>
            </div>
          </div>
        </ExpandableCard>

        <ExpandableCard
          title="Municipality Escalation"
          subtitle={municipality?.title || 'No escalation needed'}
          icon={<Building2 size={16} />}
        >
          {municipality ? (
            <div className="flex flex-col gap-2 text-sm">
              <div className="p-3 bg-muted/30 rounded-xl">
                <p className="font-medium text-foreground mb-2">{municipality.title}</p>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span>Location: {municipality.location}</span>
                  <span>Reports: {municipality.reports}</span>
                  <span>Department: {municipality.department}</span>
                  <span className="font-medium text-primary mt-1">{municipality.recommendation}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200">
                  Status: {municipality.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No infrastructure issue ready for escalation.</p>
          )}
        </ExpandableCard>

        <ExpandableCard
          title="Severity Summary"
          subtitle="Incident severity distribution across all reports"
          icon={<BarChart2 size={16} />}
        >
          <SeverityChart incidents={incidents} />
        </ExpandableCard>

        <ExpandableCard
          title="Alert & Emergency Status"
          subtitle={alertMessage}
          icon={<Bell size={16} />}
        >
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-xs text-muted-foreground">Alerts Status</span>
              <span className={cn('text-xs font-semibold', alertsEnabled ? 'text-secondary' : 'text-muted-foreground')}>
                {alertsEnabled ? 'Active' : 'Off'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-xs text-muted-foreground">Emergency Mode</span>
              <span className={cn('text-xs font-semibold', emergency.status === 'Prepared' ? 'text-primary' : 'text-secondary')}>
                {emergency.status}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-xs text-muted-foreground">Alert Message</span>
              <span className="text-xs font-medium text-foreground">{alertMessage}</span>
            </div>
          </div>
        </ExpandableCard>

        {/* Heatmap incidents list */}
        <ExpandableCard
          title="Incident Heatmap"
          subtitle={`${incidents.length} active incidents in your area`}
          icon={<Zap size={16} />}
        >
          <HeatmapPanel incidents={incidents} />
        </ExpandableCard>

        {/* Actions */}
        <ExpandableCard
          title="Quick Actions"
          subtitle="Live tracking, sharing & escalation"
          icon={<Navigation size={16} />}
        >
          <ActionPanel />
        </ExpandableCard>
      </div>
    </div>
  )
}
