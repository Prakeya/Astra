import { calculateSafetyScore } from '../engine/safetyEngine'

export function guardianAgent(context) {
  const result = calculateSafetyScore(context)

  if (result.riskLevel === 'High') {
    return {
      action: 'escalate',
      message: 'High risk detected. Notify guardians and trusted contacts.',
      ...result,
    }
  }

  if (result.riskLevel === 'Medium') {
    return {
      action: 'warn',
      message: 'Medium risk. Recommend alternate route and check-in.',
      ...result,
    }
  }

  return {
    action: 'monitor',
    message: 'Route appears safe. Continue monitoring.',
    ...result,
  }
}