export function routeAgent(routes: Array<{ name: string; riskScore: number }>) {
  return [...routes].sort((a, b) => a.riskScore - b.riskScore)[0]
}
