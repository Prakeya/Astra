import type { Incident } from '../data/sampleIncidents'

export function municipalityAgent(clusterItem?: Partial<Incident> | null) {
  if (!clusterItem) return null
  return {
    title: 'Roadlight repair needed',
    location: clusterItem.location || 'Unknown',
    reports: 12,
    severity: 'High',
    recommendation: 'Escalate to civic maintenance department (BESCOM)',
    department: 'BESCOM',
    sentAt: new Date().toISOString(),
    status: 'pending' as const,
  }
}
