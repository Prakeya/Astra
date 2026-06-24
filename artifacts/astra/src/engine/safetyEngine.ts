import type { Incident } from '../data/sampleIncidents'

export function computeSafetyScore(incidents: Incident[], timeOfDay: number, weather: string): number {
  if (incidents.length === 0) return 90

  const avgSeverity = incidents.reduce((s, i) => s + i.severity, 0) / incidents.length
  const nightPenalty = (timeOfDay >= 21 || timeOfDay <= 5) ? 10 : 0
  const weatherPenalty = (weather === 'fog' || weather === 'rain') ? 5 : 0
  const incidentPenalty = Math.min(30, incidents.length * 3)

  return Math.max(20, Math.min(100, 95 - avgSeverity * 5 - nightPenalty - weatherPenalty - incidentPenalty))
}

export function getRouteRisk(incidents: Incident[], routeName: string): 'Low' | 'Moderate' | 'High' {
  const routeIncidents = incidents.filter((i) => i.location.toLowerCase().includes(routeName.toLowerCase()))
  if (routeIncidents.length === 0) return 'Low'
  const max = Math.max(...routeIncidents.map((i) => i.severity))
  if (max >= 4) return 'High'
  if (max >= 3) return 'Moderate'
  return 'Low'
}
