import { getSimilarIncidents } from './knowledgeLayer'

export function calculateSafetyScore(context) {
  const {
    reports = [],
    historicalIncidents = [],
    timeOfDay = 12,
    weather = 'clear',
    crowdDensity = 0.7,
    trustScores = [],
    route = [],
  } = context

  const similar = getSimilarIncidents(reports, historicalIncidents, route)
  const reportWeight = reports.length * 4
  const historicalWeight = historicalIncidents.length * 2
  const timeWeight = timeOfDay >= 21 || timeOfDay <= 5 ? 12 : 0
  const weatherWeight = weather === 'rain' ? 5 : weather === 'fog' ? 8 : 0
  const crowdWeight = crowdDensity < 0.3 ? 10 : crowdDensity < 0.5 ? 5 : 0
  const trustBonus = trustScores.length
    ? Math.round(trustScores.reduce((a, b) => a + b, 0) / trustScores.length)
    : 50
  const similarityWeight = similar.length * 6

  let score = 100 - reportWeight - historicalWeight - timeWeight - weatherWeight - crowdWeight - similarityWeight
  score = Math.max(0, Math.min(100, score))

  const confidence = Math.max(40, Math.min(99, Math.round((trustBonus + score) / 2)))
  const riskLevel = score >= 75 ? 'Low' : score >= 45 ? 'Medium' : 'High'

  const reasons = []
  if (timeWeight) reasons.push('late-night travel')
  if (weatherWeight) reasons.push(`weather: ${weather}`)
  if (crowdWeight) reasons.push('isolated route')
  if (reports.length) reasons.push(`${reports.length} recent community reports`)
  if (similar.length) reasons.push(`${similar.length} similar incidents nearby`)

  return {
    score,
    confidence,
    riskLevel,
    reasons,
    similar,
  }
}

export function recommendRoute(routes) {
  return [...routes].sort((a, b) => a.riskScore - b.riskScore)[0]
}