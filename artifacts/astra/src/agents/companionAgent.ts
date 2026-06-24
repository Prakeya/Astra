export default function companionAgent({
  minutesToHome,
  riskLevel,
}: {
  minutesToHome: number
  riskLevel: 'Low' | 'Moderate' | 'High'
}): string {
  if (riskLevel === 'High') return 'Stay alert. Share your live location.'
  if (minutesToHome <= 5) return "Almost there! You're doing great."
  if (minutesToHome <= 10) return 'Almost home. Stay on the main road.'
  return 'I am tracking your route. You are safe.'
}
