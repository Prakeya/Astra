interface PredictionContext {
  weather: string
  dayOfWeek: string
  timeOfDay: number
  historicalIncidents: Array<{ severity: number; location: string }>
}

export function predictionAgent(context: PredictionContext) {
  const avgSeverity =
    context.historicalIncidents.length > 0
      ? context.historicalIncidents.reduce((s, i) => s + i.severity, 0) / context.historicalIncidents.length
      : 2

  const riskScore = Math.min(100, avgSeverity * 18 + (context.timeOfDay >= 20 ? 15 : 0))

  return {
    riskScore: Math.round(riskScore),
    note: `Route risk is influenced by ${context.weather} weather and ${context.dayOfWeek} night travel.`,
    proactiveWarning:
      riskScore > 60
        ? 'This area may be risky in the next 30 minutes based on patterns.'
        : null,
  }
}
