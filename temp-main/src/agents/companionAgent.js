export function companionAgent(context) {
  const mins = context.minutesToHome ?? 0
  const risk = context.riskLevel ?? 'Low'

  if (risk === 'High') {
    return `High risk ahead. Stay alert and consider rerouting.`
  }

  if (mins <= 10) {
    return `You are ${mins} minutes from home. Do you want me to keep monitoring?`
  }

  return `Walk Mode active. I am tracking your journey.`
}