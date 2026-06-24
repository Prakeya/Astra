import { createContext, useContext, ReactNode } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import sampleIncidents, { Incident } from '../data/sampleIncidents'

interface TrustedContact {
  id: string
  name: string
  phone: string
  relation: string
}

interface SafeZone {
  id: string
  name: string
  address: string
  type: 'home' | 'work' | 'other'
}

interface UserPreferences {
  guardianRadius: number
  voiceTrigger: string
  backgroundMode: boolean
  silentSOS: boolean
  autoCallPolice: boolean
  shareWithFamily: boolean
  deterrentAlarm: boolean
  notificationSound: string
  language: string
  autoEscalationDelay: number
  checkInInterval: number
  sosCountdown: number
}

interface AstraUser {
  name: string
  phone: string
  email: string
  verified: boolean
  trustScore: number
  guardianScore: number
  badges: string[]
  womenHelped: number
  helpfulReports: number
  falseReports: number
  isGuardian: boolean
  trustedContacts: TrustedContact[]
  safeZones: SafeZone[]
  preferences: UserPreferences
}

interface AppContextType {
  user: AstraUser
  updateUser: (patch: Partial<AstraUser>) => void
  incidents: Incident[]
  addIncident: (incident: Incident) => void
  deleteIncident: (id: number) => void
  alertsEnabled: boolean
  setAlertsEnabled: (v: boolean) => void
  emergencyEnabled: boolean
  setEmergencyEnabled: (v: boolean) => void
}

const AppContext = createContext<AppContextType | null>(null)

const defaultUser: AstraUser = {
  name: 'Priya Sharma',
  phone: '+91 98765 43210',
  email: 'priya@example.com',
  verified: true,
  trustScore: 4.8,
  guardianScore: 4.8,
  badges: ['Shield Bearer', 'Night Guardian'],
  womenHelped: 12,
  helpfulReports: 5,
  falseReports: 0,
  isGuardian: true,
  trustedContacts: [
    { id: 'tc1', name: 'Mom', phone: '+91 98765 43210', relation: 'family' },
    { id: 'tc2', name: 'Sister', phone: '+91 98765 43211', relation: 'family' },
  ],
  safeZones: [
    { id: 'sz1', name: 'Home', address: '123 MG Road, Bangalore', type: 'home' },
    { id: 'sz2', name: 'College', address: 'VTU Campus, Belgaum', type: 'work' },
  ],
  preferences: {
    guardianRadius: 500,
    voiceTrigger: 'Astra help',
    backgroundMode: true,
    silentSOS: true,
    autoCallPolice: true,
    shareWithFamily: true,
    deterrentAlarm: true,
    notificationSound: 'gentle',
    language: 'en',
    autoEscalationDelay: 60,
    checkInInterval: 5,
    sosCountdown: 3,
  },
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<AstraUser>('astra-user', defaultUser)
  const [incidents, setIncidents] = useLocalStorage<Incident[]>('astra-incidents', sampleIncidents)
  const [alertsEnabled, setAlertsEnabled] = useLocalStorage<boolean>('astra-alerts-enabled', true)
  const [emergencyEnabled, setEmergencyEnabled] = useLocalStorage<boolean>('astra-emergency-enabled', true)

  function updateUser(patch: Partial<AstraUser>) { setUser({ ...user, ...patch }) }
  function addIncident(incident: Incident) { setIncidents([incident, ...incidents]) }
  function deleteIncident(id: number) { setIncidents(incidents.filter((i) => i.id !== id)) }

  return (
    <AppContext.Provider value={{
      user, updateUser,
      incidents, addIncident, deleteIncident,
      alertsEnabled, setAlertsEnabled,
      emergencyEnabled, setEmergencyEnabled,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
