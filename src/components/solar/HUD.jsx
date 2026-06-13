import { motion } from 'framer-motion';
import { Search, Pause, Play, RotateCcw, Sun as SunIcon } from 'lucide-react';

const PLANET_COLORS = {
  mercury: '#b0b0b0',
  venus: '#e8c56a',
  earth: '#4a9eff',
  mars: '#ff6030',
  jupiter: '#d4a060',
  saturn: '#e0c080',
  uranus: '#7fffd4',
  neptune: '#4169e1',
};

const HUD = ({
  planets,
  selectedPlanet,
  searchQuery,
  onSearchChange,
  paused,
  onTogglePause,
  onReset,
  onPlanetSelect,
  speedMultiplier,
  onSpeedChange,
}) => {
  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', damping: 20 }}
        className="solar-topbar"
      >
        <div className="solar-brand">
          <div className="solar-brand-mark">SS</div>
          <div>
            <div className="solar-brand-kicker">LOOK UP</div>
            <div className="solar-brand-title">Solar System</div>
          </div>
        </div>

        <div className="solar-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search planets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} aria-label="Clear search">
              x
            </button>
          )}
        </div>

        <div className="solar-controls">
          <label className="solar-speed-control">
            <span>SPEED</span>
            <select value={speedMultiplier} onChange={(e) => onSpeedChange(Number(e.target.value))}>
              <option value={0.25}>0.25x</option>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
              <option value={10}>10x</option>
            </select>
          </label>

          <button
            onClick={onTogglePause}
            title={paused ? 'Resume' : 'Pause'}
            className={paused ? 'solar-icon-btn is-active' : 'solar-icon-btn'}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            <span>{paused ? 'PLAY' : 'PAUSE'}</span>
          </button>

          <button onClick={onReset} title="Reset view" className="solar-icon-btn solar-icon-only">
            <RotateCcw size={14} />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', damping: 20 }}
        className="solar-planet-nav"
      >
        <button
          onClick={() => onPlanetSelect(null)}
          title="Sun"
          className={selectedPlanet === null ? 'solar-planet-btn is-sun is-active' : 'solar-planet-btn is-sun'}
        >
          <SunIcon size={20} />
        </button>

        {planets.map((planet) => {
          const isFiltered = searchQuery && !planet.name.toLowerCase().includes(searchQuery.toLowerCase());
          if (isFiltered) return null;

          const isActive = selectedPlanet?.id === planet.id;
          const color = PLANET_COLORS[planet.id] || '#ffffff';

          return (
            <button
              key={planet.id}
              onClick={() => onPlanetSelect(planet)}
              title={planet.name}
              className={isActive ? 'solar-planet-btn is-active' : 'solar-planet-btn'}
              style={{
                '--planet-color': color,
              }}
            >
              <div className="solar-planet-dot" />
              <span>{planet.name.substring(0, 3)}</span>
              {isActive && <div className="solar-active-indicator" />}
            </button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="solar-statusbar"
      >
        <div className="solar-status-item">
          <div className="solar-live-dot" />
          <span>SOLAR SYSTEM EXPLORER v1.0</span>
        </div>
        <span>DRAG TO ROTATE | SCROLL TO ZOOM | CLICK TO SELECT</span>
        <div>{paused ? 'PAUSED' : `${speedMultiplier}x SPEED`}</div>
      </motion.div>
    </>
  );
};

export default HUD;
