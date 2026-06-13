import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Zap, Weight, Thermometer, RotateCcw, Orbit, Moon, Atom, ChevronDown, ChevronUp } from 'lucide-react';

const PLANET_FACTS = {
  mercury: [
    'Mercury has the most extreme temperature swings in the solar system.',
    'A day on Mercury, sunrise to sunrise, lasts 176 Earth days.',
    'Mercury has a large iron core making up about 85% of its radius.',
    'Despite being closest to the Sun, Venus is hotter than Mercury.',
  ],
  venus: [
    'Venus rotates backwards compared to most planets.',
    'A day on Venus is longer than its year.',
    'Venus has no moons and no magnetic field.',
    'The atmospheric pressure on Venus is 92 times that of Earth.',
  ],
  earth: [
    'Earth is the only known planet to harbor life.',
    'Earth\'s magnetic field protects us from solar wind.',
    'About 71% of Earth\'s surface is covered by water.',
    'Earth\'s Moon stabilizes its axial tilt, making climate more stable.',
  ],
  mars: [
    'Mars has the tallest volcano in the solar system: Olympus Mons.',
    'Mars has two small moons: Phobos and Deimos.',
    'A Martian day, or sol, is only 37 minutes longer than an Earth day.',
    'Mars has seasons similar to Earth due to its axial tilt.',
  ],
  jupiter: [
    'Jupiter\'s Great Red Spot is a storm that has lasted over 350 years.',
    'Jupiter has at least 95 known moons.',
    'One day on Jupiter lasts only about 10 Earth hours.',
    'Jupiter\'s mass is 2.5 times all other planets combined.',
  ],
  saturn: [
    'Saturn\'s rings are made of ice and rock, up to 1 km thick.',
    'Saturn is the least dense planet and would float on water.',
    'Titan, Saturn\'s largest moon, has a thick atmosphere and liquid lakes.',
    'Saturn has 146 known moons.',
  ],
  uranus: [
    'Uranus rotates on its side with an axial tilt of 97.77 degrees.',
    'Uranus has the coldest planetary atmosphere, about -224 C.',
    'Uranus appears blue-green due to methane in its atmosphere.',
    'Uranus has 13 known rings.',
  ],
  neptune: [
    'Neptune has the strongest winds in the solar system, up to 2,100 km/h.',
    'Neptune was the first planet predicted by math before being observed.',
    'Triton, Neptune\'s moon, orbits backwards and will be torn apart in about 3.6 billion years.',
    'Neptune takes 165 Earth years to orbit the Sun.',
  ],
};

const ACCENT_COLORS = {
  mercury: '#b0b0b0',
  venus: '#e8c56a',
  earth: '#4a9eff',
  mars: '#ff6030',
  jupiter: '#d4a060',
  saturn: '#e0c080',
  uranus: '#7fffd4',
  neptune: '#4169e1',
};

const formatMass = (mass) => {
  if (!mass) return 'Unknown';
  return `${mass.massValue.toFixed(3)} x 10^${mass.massExponent} kg`;
};

const formatDistance = (km) => {
  if (!km) return 'Unknown';
  if (km >= 1e9) return `${(km / 1e9).toFixed(3)} billion km`;
  return `${(km / 1e6).toFixed(2)} million km`;
};

const formatRotation = (hours) => {
  if (!hours) return 'Unknown';
  const absH = Math.abs(hours);
  const retrograde = hours < 0 ? ' (retrograde)' : '';
  if (absH >= 24) return `${(absH / 24).toFixed(2)} days${retrograde}`;
  return `${absH.toFixed(2)} hours${retrograde}`;
};

const formatOrbit = (days) => {
  if (!days) return 'Unknown';
  if (days >= 365) return `${(days / 365.25).toFixed(2)} years`;
  return `${days.toFixed(2)} days`;
};

const StatRow = ({ icon: Icon, label, value, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    borderLeft: `2px solid ${color}33`,
    marginBottom: '6px',
  }}>
    <Icon size={14} style={{ color, flexShrink: 0 }} />
    <span style={{ color: '#8892a4', fontSize: '0.75rem', minWidth: '120px', flexShrink: 0 }}>{label}</span>
    <span style={{ color: '#e2e8f0', fontSize: '0.8rem', fontFamily: 'Courier New, monospace', marginLeft: 'auto', textAlign: 'right' }}>{value || '-'}</span>
  </div>
);

const PlanetInfoPanel = ({ planet, onClose }) => {
  const [showFacts, setShowFacts] = useState(false);
  if (!planet) return null;

  const accent = ACCENT_COLORS[planet.id] || '#22d3ee';
  const facts = PLANET_FACTS[planet.id] || [];

  return (
    <AnimatePresence>
      <motion.div
        key={planet.id}
        initial={{ opacity: 0, x: 60, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          translate: '0 -50%',
          width: '320px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(160deg, rgba(5,8,22,0.97) 0%, rgba(8,10,28,0.95) 100%)',
          border: `1px solid ${accent}33`,
          borderRadius: '12px',
          backdropFilter: 'blur(20px)',
          zIndex: 100,
          boxShadow: `0 0 40px ${accent}15, 0 20px 60px rgba(0,0,0,0.7)`,
          scrollbarWidth: 'thin',
        }}
      >
        <div style={{
          height: '4px',
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          borderRadius: '12px 12px 0 0',
        }} />

        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: accent, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'Courier New, monospace', marginBottom: '4px' }}>
                PLANET DATA
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                {planet.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ height: '1px', background: `linear-gradient(90deg, ${accent}40, transparent)`, marginBottom: '16px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <StatRow icon={Globe} label="Mean Radius" value={planet.meanRadius ? `${planet.meanRadius.toLocaleString()} km` : null} color={accent} />
            <StatRow icon={Weight} label="Mass" value={formatMass(planet.mass)} color={accent} />
            <StatRow icon={Zap} label="Gravity" value={planet.gravity ? `${planet.gravity} m/s^2` : null} color={accent} />
            <StatRow icon={Atom} label="Density" value={planet.density ? `${planet.density} g/cm^3` : null} color={accent} />
            <StatRow icon={Orbit} label="Orbital Period" value={formatOrbit(planet.sideralOrbit)} color={accent} />
            <StatRow icon={RotateCcw} label="Rotation Period" value={formatRotation(planet.sideralRotation)} color={accent} />
            <StatRow icon={Globe} label="Distance from Sun" value={formatDistance(planet.distanceFromSun)} color={accent} />
            <StatRow icon={Moon} label="Number of Moons" value={planet.moons !== undefined ? `${planet.moons}` : null} color={accent} />
            <StatRow icon={Thermometer} label="Avg Temperature" value={planet.avgTemp ? `${planet.avgTemp} K (${(planet.avgTemp - 273).toFixed(0)} C)` : null} color={accent} />
          </div>

          {facts.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => setShowFacts(f => !f)}
                style={{
                  width: '100%',
                  background: `${accent}15`,
                  border: `1px solid ${accent}30`,
                  borderRadius: '8px',
                  color: accent,
                  cursor: 'pointer',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'Courier New, monospace',
                }}
              >
                <span>Interesting Facts</span>
                {showFacts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <AnimatePresence>
                {showFacts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {facts.map((fact, i) => (
                        <div
                          key={fact}
                          style={{
                            padding: '10px 12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            borderLeft: `2px solid ${accent}60`,
                            fontSize: '0.78rem',
                            color: '#cbd5e1',
                            lineHeight: '1.5',
                          }}
                        >
                          <span style={{ color: accent, marginRight: '6px', fontFamily: 'Courier New' }}>{i + 1}.</span>
                          {fact}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div style={{
            marginTop: '16px',
            padding: '8px 12px',
            background: `${accent}0a`,
            borderRadius: '8px',
            border: `1px solid ${accent}20`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}`, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'Courier New, monospace', letterSpacing: '1px' }}>
              DATA SOURCE: LE-SYSTEME-SOLAIRE.NET
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlanetInfoPanel;
