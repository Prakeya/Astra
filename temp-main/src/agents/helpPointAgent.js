export function helpPointAgent(points = []) {
  return points.sort((a, b) => a.distanceKm - b.distanceKm)[0] || null
}