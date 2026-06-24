export function helpPointAgent(points: Array<{ name: string; distanceKm: number }>) {
  return [...points].sort((a, b) => a.distanceKm - b.distanceKm)[0]
}
