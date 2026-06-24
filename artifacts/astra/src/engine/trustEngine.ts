import type { Incident } from '../data/sampleIncidents'

export function computeTrustScore(incidents: Incident[], verifiedCount: number, totalCount: number): number {
  if (totalCount === 0) return 50
  const verificationRatio = verifiedCount / totalCount
  const avgSeverity = incidents.reduce((s, i) => s + i.severity, 0) / incidents.length || 2.5
  return Math.min(100, Math.round(verificationRatio * 60 + (5 - avgSeverity) * 8))
}

export function clusterIncidents(incidents: Incident[]): Record<string, Incident[]> {
  return incidents.reduce<Record<string, Incident[]>>((clusters, incident) => {
    const key = incident.location
    if (!clusters[key]) clusters[key] = []
    clusters[key].push(incident)
    return clusters
  }, {})
}
