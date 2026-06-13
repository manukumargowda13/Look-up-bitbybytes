import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlanetData } from '../hooks/usePlanetData';
import SolarScene from '../components/solar/SolarScene';
import PlanetInfoPanel from '../components/solar/PlanetInfoPanel';
import HUD from '../components/solar/HUD';
import '../styles/solar.css';

const LoadingScreen = () => (
  <div className="solar-loading">
    <motion.div
      className="solar-loading-inner"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="solar-loading-sun"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        SUN
      </motion.div>
      <motion.div
        className="solar-loading-text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        INITIALIZING SOLAR SYSTEM...
      </motion.div>
      <div className="solar-loading-bars">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="solar-loading-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.3, duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </div>
    </motion.div>
  </div>
);

const SolarSystemExplorer = () => {
  const navigate = useNavigate();
  const { planets, loading, error } = usePlanetData();
  const [selectedPlanet, setSelectedPlanet] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [paused, setPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [resetKey, setResetKey] = useState(0);

  const handlePlanetClick = useCallback((planet) => {
    setSelectedPlanet(planet);
  }, []);

  const handleSunClick = useCallback(() => {
    setSelectedPlanet(null);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedPlanet(undefined);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedPlanet(undefined);
    setSearchQuery('');
    setResetKey(k => k + 1);
  }, []);

  const handlePlanetSelect = useCallback((planet) => {
    setSelectedPlanet(planet);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="solar-explorer">
      <motion.button
        className="solar-back-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft size={16} />
        <span>Dashboard</span>
      </motion.button>

      {error && (
        <motion.div
          className="solar-api-status"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <WifiOff size={12} />
          <span>Offline Data Mode</span>
        </motion.div>
      )}

      <div className="solar-canvas-wrapper">
        <SolarScene
          key={resetKey}
          planets={planets}
          selectedPlanet={selectedPlanet}
          onPlanetClick={handlePlanetClick}
          onSunClick={handleSunClick}
          paused={paused}
          speedMultiplier={speedMultiplier}
          searchQuery={searchQuery}
        />
      </div>

      <HUD
        planets={planets}
        selectedPlanet={selectedPlanet}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        paused={paused}
        onTogglePause={() => setPaused(p => !p)}
        onReset={handleReset}
        onPlanetSelect={handlePlanetSelect}
        speedMultiplier={speedMultiplier}
        onSpeedChange={setSpeedMultiplier}
      />

      <AnimatePresence>
        {(selectedPlanet !== undefined && selectedPlanet !== null) && (
          <PlanetInfoPanel
            planet={selectedPlanet}
            onClose={handleClosePanel}
          />
        )}
        {selectedPlanet === null && (
          <motion.div
            className="solar-sun-panel"
            key="sun-panel"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="solar-sun-panel-header">The Sun</div>
            <div className="solar-sun-stats">
              <div className="solar-sun-stat"><span>Type</span><span>G-type Main Sequence Star</span></div>
              <div className="solar-sun-stat"><span>Radius</span><span>696,340 km</span></div>
              <div className="solar-sun-stat"><span>Mass</span><span>1.989 x 10^30 kg</span></div>
              <div className="solar-sun-stat"><span>Surface Temp</span><span>5,778 K</span></div>
              <div className="solar-sun-stat"><span>Core Temp</span><span>~15,000,000 K</span></div>
              <div className="solar-sun-stat"><span>Age</span><span>4.6 Billion Years</span></div>
              <div className="solar-sun-stat"><span>Rotation Period</span><span>~25 days (equator)</span></div>
            </div>
            <button className="solar-sun-close" onClick={handleClosePanel}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolarSystemExplorer;
