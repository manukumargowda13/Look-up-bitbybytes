
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobeView from '../components/GlobeView';
import SatelliteDirectory from '../components/SatelliteDirectory';
import SatelliteInfo from '../components/SatelliteInfo';
import OrbitalPanel from '../components/OrbitalPanel';
import CosmicConditions from '../components/CosmicConditions';
import AstronomyCard from '../components/AstronomyCard';
import AsteroidCard from '../components/AsteroidCard';
import AIAssistant from '../components/AIAssistant';
import VisibilityPanel from '../components/VisibilityPanel';
import CelestialDashboard from '../components/CelestialDashboard';
import SpaceXTracker from '../components/SpaceXTracker';
import MoonExplorer from '../components/MoonExplorer';
import SmartAlertSystem from '../components/SmartAlertSystem';
import TimeMachineMode from '../components/TimeMachineMode';
import SolarSystemViewer from '../components/SolarSystemViewer';
import { SatelliteContext } from '../context/SatelliteContext';
import { Satellite, MapPin, Image as ImageIcon, AlertTriangle, Globe, Star, Rocket, Moon, Bell, Clock, Orbit } from 'lucide-react';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { intelligenceData } = React.useContext(SatelliteContext);
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      {/* Left Column */}
      <div className="left-panel panel">
        <div className="panel-header">
          <Satellite size={16} />
          <span>Tracked Satellites</span>
        </div>
        <div className="panel-desc">Click to select a satellite and view its orbital information in real-time.</div>
        <SatelliteDirectory />
      </div>

      {/* Center - Globe */}
      <div className="globe-section">
        <div className="globe-centerplate">
          <GlobeView />
          <div className="hud-overlay">
            <div className="hud-item">T+ 00:12:34</div>
            <div className="hud-item">Live Stream</div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="right-panel panel">
        <div className="panel-header">
          <MapPin size={16} />
          <span>Satellite Information</span>
        </div>
        <div className="panel-desc">Details about the selected satellite including status, altitude, and agency.</div>
        <SatelliteInfo />

        <div className="panel-header" style={{ marginTop: '18px' }}>
          <Satellite size={16} />
          <span>ISS Tracking</span>
        </div>
        <div className="panel-desc">Live ISS position and tracking status from the backend service.</div>
        <OrbitalPanel />
      </div>

      {/* Bottom - Space Weather */}
      <div className="bottom-panel panel">
        <div className="panel-header" style={{ position: 'absolute', top: 10, left: 20, border: 'none', margin: 0 }}>
          <Satellite size={16} />
          <span>Space Weather Today</span>
        </div>
        <div className="panel-desc" style={{ position: 'absolute', top: 40, left: 20, right: 20 }}>Current solar and radiation conditions with an easy-to-read risk indicator.</div>
        <CosmicConditions />
      </div>

      {/* Bottom-Left - NASA APOD */}
      <div className="apod-panel panel">
        <div className="panel-header">
          <ImageIcon size={16} />
          <span>Astronomy Picture of the Day</span>
        </div>
        <div className="panel-desc">Today's NASA image featuring stunning space photography and discoveries.</div>
        <AstronomyCard />
      </div>

      {/* Bottom-Center - Visibility Control */}
      <div className="visibility-panel panel">
        <div className="panel-header">
          <Globe size={16} />
          <span>Visibility Control</span>
        </div>
        <div className="panel-desc">Choose your location to unlock real-time viewability and ISS pass forecasts.</div>
        <VisibilityPanel />
      </div>

      {/* Bottom-Right - Near Earth Objects */}
      <div className="asteroids-panel panel">
        <div className="panel-header">
          <AlertTriangle size={16} />
          <span>Near Earth Objects</span>
        </div>
        <div className="panel-desc">Asteroids approaching Earth with hazard status and distance information.</div>
        <AsteroidCard />
      </div>

      {/* Row 4 */}
      <div className="celestial-panel panel">
        <div className="panel-header">
          <Star size={16} />
          <span>Celestial Events</span>
        </div>
        <div className="panel-desc">Upcoming eclipses, showers, and alignments.</div>
        <CelestialDashboard />
      </div>

      <div className="spacex-panel panel">
        <div className="panel-header">
          <Rocket size={16} />
          <span>SpaceX Launches</span>
        </div>
        <div className="panel-desc">Upcoming SpaceX missions and countdowns.</div>
        <SpaceXTracker />
      </div>

      <div className="moon-panel panel" style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
        <div className="panel-header">
          <Moon size={16} />
          <span>Moon Explorer</span>
        </div>
        <div className="panel-desc">Current lunar phase and visibility.</div>
        <MoonExplorer moonData={intelligenceData?.astronomy} />
        <button
          onClick={() => navigate('/lunar-missions')}
          style={{
            marginTop: 'auto',
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(135deg, rgba(79,195,247,0.15), rgba(123,97,255,0.15))',
            border: '1px solid rgba(79,195,247,0.3)',
            borderRadius: '8px',
            color: '#4fc3f7',
            fontSize: '0.78rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Courier New, monospace',
          }}
          onMouseEnter={e => { e.target.style.background = 'linear-gradient(135deg, rgba(79,195,247,0.25), rgba(123,97,255,0.25))'; e.target.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.target.style.background = 'linear-gradient(135deg, rgba(79,195,247,0.15), rgba(123,97,255,0.15))'; e.target.style.transform = 'translateY(0)'; }}
        >
          🌕 Launch Lunar Missions Explorer
        </button>
      </div>

      {/* Row 5 */}
      <div className="alerts-panel panel">
        <div className="panel-header">
          <Bell size={16} />
          <span>Smart Alerts</span>
        </div>
        <div className="panel-desc">Real-time event notifications for your location.</div>
        <SmartAlertSystem locationData={intelligenceData} />
      </div>

      <div className="solar-panel panel">
        <div className="panel-header">
          <Orbit size={16} />
          <span>Solar System</span>
        </div>
        <div className="panel-desc">Interactive planetary viewer.</div>
        <SolarSystemViewer />
      </div>

      <div className="time-panel panel">
        <div className="panel-header">
          <Clock size={16} />
          <span>Time Machine</span>
        </div>
        <div className="panel-desc">Simulate past and future sky events.</div>
        <TimeMachineMode />
      </div>

      {/* AI Assistant - Floating Button */}
      <AIAssistant />
    </div>
  );
};

export default Dashboard;