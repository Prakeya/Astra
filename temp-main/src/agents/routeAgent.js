export function routeAgent(routes = []) {
  if (!routes.length) return null
  return [...routes].sort((a, b) => a.riskScore - b.riskScore)[0]
}