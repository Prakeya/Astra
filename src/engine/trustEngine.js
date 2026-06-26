export function calculateTrustScore(user) {
  const base = user.verified ? 70 : 45
  const bonus = (user.helpfulReports || 0) * 3
  const penalty = (user.falseReports || 0) * 10
  return Math.max(0, Math.min(100, base + bonus - penalty))
}

export function weightIncident(incident, trustScore) {
  return Math.round((incident.severity || 5) * (trustScore / 100))
}