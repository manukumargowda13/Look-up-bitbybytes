import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import SolarSystemExplorer from './pages/SolarSystemExplorer'
import LunarMissionsExplorer from './pages/LunarMissionsExplorer'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/solar-system" element={<SolarSystemExplorer />} />
      <Route path="/lunar-missions" element={<LunarMissionsExplorer />} />
    </Routes>
  )
}

export default App
