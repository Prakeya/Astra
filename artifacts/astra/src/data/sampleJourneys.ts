export interface Journey {
  id: number
  from: string
  to: string
  status: 'Safe' | 'Alert' | 'Emergency'
  duration: string
  date?: string
  guardians?: number
  alerts?: string[]
}

const sampleJourneys: Journey[] = [
  {
    id: 1,
    from: 'College',
    to: 'Home',
    status: 'Safe',
    duration: '18 min',
    date: '2026-06-23',
    guardians: 3,
    alerts: [],
  },
  {
    id: 2,
    from: 'Office',
    to: 'Metro',
    status: 'Alert',
    duration: '12 min',
    date: '2026-06-22',
    guardians: 2,
    alerts: ['Dark alley ahead', 'Rerouted to MG Road'],
  },
  {
    id: 3,
    from: 'Station',
    to: 'Home',
    status: 'Safe',
    duration: '9 min',
    date: '2026-06-21',
    guardians: 1,
    alerts: [],
  },
  {
    id: 4,
    from: 'Mall',
    to: 'Home',
    status: 'Safe',
    duration: '22 min',
    date: '2026-06-20',
    guardians: 4,
    alerts: [],
  },
]

export default sampleJourneys
