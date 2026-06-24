import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'

// Pages
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import WalkMode from './pages/WalkMode'
import SOS from './pages/SOS'
import SafeNow from './pages/SafeNow'
import ReportIssue from './pages/ReportIssue'
import GuardiansNearby from './pages/GuardiansNearby'
import Profile from './pages/Profile'
import History from './pages/History'
import Alerts from './pages/Alerts'
import MapView from './pages/MapView'
import NotFound from '@/pages/not-found'

const queryClient = new QueryClient()

// Routes that show the bottom nav bar
const NAV_ROUTES = ['/dashboard', '/walk', '/sos', '/guardians', '/profile', '/report', '/history', '/alerts', '/safe-now', '/map']

function AppShell() {
  const [location] = useLocation()
  const showNav = NAV_ROUTES.some((r) => location === r || location.startsWith(r + '/'))

  return (
    <>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/walk" component={WalkMode} />
        <Route path="/sos" component={SOS} />
        <Route path="/safe-now" component={SafeNow} />
        <Route path="/report" component={ReportIssue} />
        <Route path="/guardians" component={GuardiansNearby} />
        <Route path="/profile" component={Profile} />
        <Route path="/history" component={History} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/map" component={MapView} />
        <Route component={NotFound} />
      </Switch>
      {showNav && <Navbar />}
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <AppShell />
          </WouterRouter>
        </AppProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
