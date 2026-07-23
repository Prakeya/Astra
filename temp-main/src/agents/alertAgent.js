export function alertAgent({ riskLevel }) {
  if (riskLevel === 'High') return 'Immediate warning: route is risky.'
  if (riskLevel === 'Medium') return 'Moderate risk: please use caution.'
  return 'Route looks safe.'
}