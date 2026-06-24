import type { Incident } from '../data/sampleIncidents'

interface User {
  verified?: boolean
  helpfulReports?: number
  falseReports?: number
  name?: string
}

export function trustAgent({ user, incidents }: { user: User; incidents: Incident[] }) {
  const baseScore = user.verified ? 70 : 40
  const reportBonus = Math.min(20, (user.helpfulReports || 0) * 4)
  const falsePenalty = Math.min(20, (user.falseReports || 0) * 10)
  const trustScore = Math.max(0, Math.min(100, baseScore + reportBonus - falsePenalty))

  return {
    trustScore,
    clustered: incidents.slice(0, 2),
    weighted: incidents.map((item, index) => ({ ...item, weight: index + 1 })),
  }
}
