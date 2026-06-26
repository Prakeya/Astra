import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import useLocalStorage from './hooks/useLocalStorage'
import Dashboard from './pages/Dashboard'
import ReportIncident from './pages/ReportIncident'
import Contacts from './pages/Contacts'
import Settings from './pages/Settings'
import History from './pages/History'
import RoutesPage from './pages/RoutesPage'
import Alerts from './pages/Alerts'
import sampleIncidents from './data/sampleIncidents'

export default function App() {
  const [user, setUser] = useLocalStorage('astra-user', {
    name: 'Priya',
    verified: true,
    helpfulReports: 5,
    falseReports: 0,
    safeZones: ['Home', 'College', 'Office'],
    trustedContacts: ['Ananya', 'Meera'],
  })

  const [incidents, setIncidents] = useLocalStorage('astra-incidents', sampleIncidents)
  const [alertsEnabled, setAlertsEnabled] = useLocalStorage('astra-alerts-enabled', true)
  const [emergencyEnabled, setEmergencyEnabled] = useLocalStorage('astra-emergency-enabled', true)

  function addIncident(incident) { setIncidents([incident, ...incidents]) }
  function deleteIncident(id) { setIncidents(incidents.filter((incident) => incident.id !== id)) }
  function updateUser(patch) { setUser({ ...user, ...patch }) }

  const highRiskCount = incidents.filter((i) => i.severity >= 4).length

  return (
    <div className="app">
      {/* Brand Header */}
      <header className="brand-header">
        <div className="brand-logo">
          <div className="brand-logo-icon">A</div>
          <div>
            <div className="brand-logo-text">ASTRA</div>
            <div className="brand-tagline">Women's Safety Network</div>
          </div>
        </div>
        <nav className="brand-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/report" className={({ isActive }) => isActive ? 'active' : ''}>Report</NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>History</NavLink>
          <NavLink to="/routes" className={({ isActive }) => isActive ? 'active' : ''}>Routes</NavLink>
          <NavLink to="/contacts" className={({ isActive }) => isActive ? 'active' : ''}>Contacts</NavLink>
          <NavLink to="/alerts" className={({ isActive }) => isActive ? 'active' : ''}>Alerts</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>Settings</NavLink>
        </nav>
      </header>

      {/* Stats Bar */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{incidents.length}</div>
          <div className="stat-label">Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{highRiskCount}</div>
          <div className="stat-label">High Risk</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user.trustedContacts.length}</div>
          <div className="stat-label">Contacts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{user.helpfulReports}</div>
          <div className="stat-label">Verified Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: user.verified ? 'var(--brand-green)' : 'var(--brand-rose)' }}>
            {user.verified ? 'Yes' : 'No'}
          </div>
          <div className="stat-label">Verified User</div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard user={user} incidents={incidents} alertsEnabled={alertsEnabled} emergencyEnabled={emergencyEnabled} />} />
        <Route path="/report" element={<ReportIncident onSave={addIncident} />} />
        <Route path="/history" element={<History incidents={incidents} onDelete={deleteIncident} />} />
        <Route path="/routes" element={<RoutesPage incidents={incidents} />} />
        <Route path="/contacts" element={<Contacts user={user} setUser={setUser} />} />
        <Route path="/alerts" element={<Alerts user={user} alertsEnabled={alertsEnabled} emergencyEnabled={emergencyEnabled} setAlertsEnabled={setAlertsEnabled} setEmergencyEnabled={setEmergencyEnabled} />} />
        <Route path="/settings" element={<Settings user={user} updateUser={updateUser} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}