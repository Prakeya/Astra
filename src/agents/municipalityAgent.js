export function municipalityAgent(cluster = {}) {
  if (!cluster || !cluster.count) return null

  return {
    title: cluster.title || 'Infrastructure issue',
    location: cluster.location || 'Unknown',
    issue: cluster.type || 'Unsafe area',
    reports: cluster.count,
    severity: cluster.count >= 10 ? 'High' : cluster.count >= 5 ? 'Medium' : 'Low',
    recommendation: 'Repair lighting immediately.',
  }
}