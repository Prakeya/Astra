export function alertAgent({
  riskLevel,
  alertsEnabled,
  emergencyEnabled,
}: {
  riskLevel: string
  alertsEnabled?: boolean
  emergencyEnabled?: boolean
}): string {
  if (!alertsEnabled) return 'Alerting is off.'
  if (riskLevel === 'High') return 'Send alert to trusted contacts'
  if (riskLevel === 'Moderate') return 'Keep companions informed'
  return 'No alert needed'
}
