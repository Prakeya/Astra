export type IncidentType = 'dark_road' | 'harassment' | 'broken_light' | 'isolated' | 'suspicious' | 'other'

export interface Incident {
  id: number
  title: string
  location: string
  severity: number // 1-5
  time: string
  type: IncidentType
  description?: string
  lat?: number
  lng?: number
  verified?: boolean
  anonymous?: boolean
  reportedAt?: string
}

const sampleIncidents: Incident[] = [
  {
    id: 1,
    title: 'Poor lighting',
    location: 'MG Road',
    severity: 3,
    time: '21:15',
    type: 'dark_road',
    description: 'Streetlights broken for 200m stretch near the overpass',
    lat: 12.9716,
    lng: 77.5946,
    verified: true,
    anonymous: false,
    reportedAt: '2026-06-22T21:15:00Z',
  },
  {
    id: 2,
    title: 'Suspicious crowding',
    location: 'Indiranagar',
    severity: 4,
    time: '22:05',
    type: 'suspicious',
    description: 'Group of 6-8 men loitering near the park entrance, making it uncomfortable to pass',
    lat: 12.9784,
    lng: 77.6408,
    verified: true,
    anonymous: true,
    reportedAt: '2026-06-22T22:05:00Z',
  },
  {
    id: 3,
    title: 'Unsafe stretch',
    location: 'Whitefield',
    severity: 5,
    time: '23:10',
    type: 'isolated',
    description: 'Completely isolated stretch with no shops or residents, very dark',
    lat: 12.9698,
    lng: 77.7499,
    verified: false,
    anonymous: true,
    reportedAt: '2026-06-22T23:10:00Z',
  },
  {
    id: 4,
    title: 'Broken streetlight',
    location: 'Koramangala',
    severity: 2,
    time: '20:30',
    type: 'broken_light',
    description: 'Two consecutive streetlights are broken near the bus stop',
    lat: 12.9352,
    lng: 77.6245,
    verified: true,
    anonymous: false,
    reportedAt: '2026-06-23T20:30:00Z',
  },
  {
    id: 5,
    title: 'Verbal harassment',
    location: 'Brigade Road',
    severity: 4,
    time: '19:45',
    type: 'harassment',
    description: 'Repeated unwanted comments from men near the parking lot',
    lat: 12.9739,
    lng: 77.6079,
    verified: false,
    anonymous: true,
    reportedAt: '2026-06-23T19:45:00Z',
  },
]

export default sampleIncidents
