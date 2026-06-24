interface GuardianContext {
  reports: Array<{ severity: number }>
  crowdDensity: number
  weather: string
  timeOfDay: number
  trustedContacts: string[] | number
  guardians: Array<{ score: number }>
}

export function guardianAgent(context: GuardianContext) {
  const highRiskReports = context.reports.filter((r) => r.severity >= 4).length
  const basePenalty = highRiskReports * 3
  const crowdBonus = context.crowdDensity >= 0.5 ? 10 : 0
  const nightPenalty = context.timeOfDay >= 21 || context.timeOfDay <= 5 ? 8 : 0
  const weatherPenalty = context.weather === 'fog' || context.weather === 'rain' ? 5 : 0

  const score = Math.max(20, Math.min(100, 88 - basePenalty - nightPenalty - weatherPenalty + crowdBonus))
  const confidence = 91
  const riskLevel: 'Low' | 'Moderate' | 'High' = score >= 80 ? 'Low' : score >= 65 ? 'Moderate' : 'High'

  return {
    score,
    confidence,
    riskLevel,
    reasons: [
      `Weather: ${context.weather}`,
      `Time: ${context.timeOfDay}:00`,
      `Crowd density: ${(context.crowdDensity * 100).toFixed(0)}%`,
    ],
  }
}
