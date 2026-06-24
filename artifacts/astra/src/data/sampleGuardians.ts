export interface Guardian {
  id: string
  name: string
  score: number
  confidence: number
  riskLevel: 'Low' | 'Moderate' | 'High'
  reasons: string[]
  distance?: number
  rating?: number
  helps?: number
  available?: boolean
  verified?: boolean
  avatar?: string
  badges?: string[]
}

const sampleGuardians: Guardian[] = [
  {
    id: 'g1',
    name: 'Ananya F.',
    score: 92,
    confidence: 94,
    riskLevel: 'Low',
    reasons: ['Well-lit route', 'Trusted area', 'Active guardians nearby'],
    distance: 120,
    rating: 4.9,
    helps: 47,
    available: true,
    verified: true,
    avatar: '',
    badges: ['Rapid Responder', 'Night Guardian'],
  },
  {
    id: 'g2',
    name: 'Rahul K.',
    score: 86,
    confidence: 89,
    riskLevel: 'Moderate',
    reasons: ['Late-night travel', 'Low crowd density', 'Foggy weather'],
    distance: 180,
    rating: 4.7,
    helps: 23,
    available: true,
    verified: true,
    avatar: '',
    badges: ['Shield Bearer'],
  },
  {
    id: 'g3',
    name: 'Meera S.',
    score: 78,
    confidence: 81,
    riskLevel: 'High',
    reasons: ['Poor lighting', 'Sparse traffic', 'Recent incident reports'],
    distance: 220,
    rating: 4.8,
    helps: 31,
    available: true,
    verified: true,
    avatar: '',
    badges: ['Night Guardian'],
  },
  {
    id: 'g4',
    name: 'Divya P.',
    score: 88,
    confidence: 90,
    riskLevel: 'Low',
    reasons: ['Safe route', 'High visibility area'],
    distance: 350,
    rating: 4.6,
    helps: 15,
    available: false,
    verified: true,
    avatar: '',
    badges: [],
  },
  {
    id: 'g5',
    name: 'Arjun M.',
    score: 83,
    confidence: 87,
    riskLevel: 'Low',
    reasons: ['Trusted area', 'Active guardian'],
    distance: 480,
    rating: 4.5,
    helps: 8,
    available: true,
    verified: false,
    avatar: '',
    badges: [],
  },
]

export default sampleGuardians
