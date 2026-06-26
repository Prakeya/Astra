export function predictionAgent(context) {
  const hour = context.timeOfDay ?? 12
  const day = context.dayOfWeek ?? 'Monday'
  const weather = context.weather ?? 'clear'

  let risk = 0
  if (hour >= 21 || hour <= 5) risk += 35
  if (['Friday', 'Saturday', 'Sunday'].includes(day)) risk += 10
  if (weather === 'rain') risk += 10
  if (weather === 'fog') risk += 15

  return {
    predictedRisk: Math.min(100, risk),
    note: risk >= 40 ? 'This area may become unsafe later tonight.' : 'No major risk trend predicted.',
  }
}