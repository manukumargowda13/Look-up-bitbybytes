import { useState, useCallback, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MoonGlobe      from '../components/lunar/MoonGlobe';
import MissionPanel   from '../components/lunar/MissionPanel';
import CountryFilter  from '../components/lunar/CountryFilter';
import MissionTimeline from '../components/lunar/MissionTimeline';
import allMissions    from '../data/lunarMissions.json';
import '../styles/lunar.css';

const ALL_COUNTRIES = ['USA', 'USSR', 'India', 'China', 'Japan', 'Israel'];
const SERIES_COLORS = {
  Apollo:      '#4FC3F7',
  Luna:        '#FF6B6B',
  Chandrayaan: '#FF9800',
  "Chang'e":   '#EF5350',
  Surveyor:    '#80DEEA',
  Other:       '#B0BEC5',
};

/* ── Loading Screen ─────────────────────────────────────────── */
function LunarLoading() {
  return (
    <div className="lunar-loading">
      <motion.div
        className="lunar-loading-moon"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        🌕
      </motion.div>
      <motion.div
        className="lunar-loading-text"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        LOADING LUNAR SURFACE...
      </motion.div>
    </div>
  );
}

/* ── Stats Strip ─────────────────────────────────────────────── */
function StatsStrip({ visibleMissions }) {
  const crewed   = visibleMissions.filter(m => m.crew?.length > 0).length;
  const success  = visibleMissions.filter(m => m.status === 'Success').length;
  const countries = [...new Set(visibleMissions.map(m => m.country))].length;

  return (
    <div className="lunar-stats-strip">
      <div className="lunar-stat-card">
        <div className="lunar-stat-label">Missions</div>
        <div className="lunar-stat-value">{visibleMissions.length}</div>
      </div>
      <div className="lunar-stat-card">
        <div className="lunar-stat-label">Crewed</div>
        <div className="lunar-stat-value">{crewed}</div>
      </div>
      <div className="lunar-stat-card">
        <div className="lunar-stat-label">Success</div>
        <div className="lunar-stat-value">{success}</div>
      </div>
      <div className="lunar-stat-card">
        <div className="lunar-stat-label">Nations</div>
        <div className="lunar-stat-value">{countries}</div>
      </div>
    </div>
  );
}

/* ── Series Legend ───────────────────────────────────────────── */
function SeriesLegend() {
  return (
    <div className="lunar-legend">
      {Object.entries(SERIES_COLORS).map(([series, color]) => (
        <div key={series} className="lunar-legend-item">
          <div className="lunar-legend-dot" style={{ background: color }} />
          {series}
        </div>
      ))}
    </div>
  );
}

/* ── Hover Tooltip ───────────────────────────────────────────── */
function HoverTooltip({ mission, position }) {
  if (!mission) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="lunar-tooltip"
        style={{ left: (position?.x ?? 0) + 16, top: (position?.y ?? 0) - 10 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="lunar-tooltip-name">{mission.flag} {mission.name}</div>
        <div className="lunar-tooltip-meta">{mission.year} · {mission.country} · {mission.type}</div>
        <div className="lunar-tooltip-meta" style={{ color: '#94a3b8', marginTop: 2 }}>
          {mission.landingSite}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Page
   ══════════════════════════════════════════════════════════════ */
export default function LunarMissionsExplorer() {
  const navigate = useNavigate();

  const [selectedMission,  setSelectedMission]  = useState(null);
  const [hoveredMission,   setHoveredMission]   = useState(null);
  const [tooltipPos,       setTooltipPos]       = useState({ x: 0, y: 0 });
  const [activeCountries,  setActiveCountries]  = useState([...ALL_COUNTRIES]);
  const [currentYear,      setCurrentYear]      = useState(2024);

  /* Filtered missions based on country + year */
  const visibleMissions = useMemo(() => {
    return allMissions.filter(
      m => activeCountries.includes(m.country) && m.year <= currentYear
    );
  }, [activeCountries, currentYear]);

  const handleToggleCountry = useCallback((country) => {
    setActiveCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  }, []);

  const handleSelectMission = useCallback((mission) => {
    setSelectedMission(prev => prev?.id === mission.id ? null : mission);
  }, []);

  const handleHoverMission = useCallback((mission) => {
    setHoveredMission(mission);
  }, []);

  const handleUnhover = useCallback(() => {
    setHoveredMission(null);
  }, []);

  const handleMouseMove = useCallback((e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleYearChange = useCallback((year) => {
    setCurrentYear(year);
    // Clear selected mission if it's now out of range
    if (selectedMission && selectedMission.year > year) {
      setSelectedMission(null);
    }
  }, [selectedMission]);

  return (
    <div className="lunar-explorer" onMouseMove={handleMouseMove}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="lunar-header">
        <motion.button
          className="lunar-back-btn"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={14} />
          Dashboard
        </motion.button>

        <motion.div
          className="lunar-header-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="lunar-icon">🌕</span>
          <h1>Lunar Missions Explorer</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: '0.72rem', color: '#64748b', letterSpacing: '2px', textTransform: 'uppercase' }}
        >
          {allMissions.length} Missions · 1959–2024
        </motion.div>
      </div>

      {/* ── 3D Globe ───────────────────────────────────────── */}
      <div className="lunar-canvas-wrap">
        <Suspense fallback={<LunarLoading />}>
          <MoonGlobe
            missions={visibleMissions}
            selectedMission={selectedMission}
            onSelectMission={handleSelectMission}
            hoveredMission={hoveredMission}
            onHoverMission={handleHoverMission}
            onUnhoverMission={handleUnhover}
          />
        </Suspense>
      </div>

      {/* ── Controls HUD ───────────────────────────────────── */}
      <motion.div
        className="lunar-controls-hud"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <span className="lunar-hud-hint">
          <RotateCcw size={11} /> Drag to rotate
        </span>
        <div className="lunar-hud-separator" />
        <span className="lunar-hud-hint">
          <ZoomIn size={11} /> Scroll to zoom
        </span>
        <div className="lunar-hud-separator" />
        <span className="lunar-hud-hint">
          🎯 Click markers for details
        </span>
      </motion.div>

      {/* ── Stats Strip (left) ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <StatsStrip visibleMissions={visibleMissions} />
      </motion.div>

      {/* ── Country Filter (right) ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <CountryFilter
          allMissions={allMissions}
          activeCountries={activeCountries}
          onToggle={handleToggleCountry}
        />
      </motion.div>

      {/* ── Series Legend (bottom-left) ────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <SeriesLegend />
      </motion.div>

      {/* ── Timeline (bottom) ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100 }}
      >
        <MissionTimeline
          allMissions={allMissions.filter(m => activeCountries.includes(m.country))}
          currentYear={currentYear}
          onYearChange={handleYearChange}
          selectedMission={selectedMission}
          onSelectMission={handleSelectMission}
        />
      </motion.div>

      {/* ── Mission Detail Panel (right) ───────────────────── */}
      <AnimatePresence>
        {selectedMission && (
          <MissionPanel
            key={selectedMission.id}
            mission={selectedMission}
            onClose={() => setSelectedMission(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Hover Tooltip ──────────────────────────────────── */}
      {hoveredMission && !selectedMission && (
        <HoverTooltip mission={hoveredMission} position={tooltipPos} />
      )}
    </div>
  );
}
