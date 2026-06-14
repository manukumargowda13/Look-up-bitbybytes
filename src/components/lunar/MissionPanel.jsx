import { motion, AnimatePresence } from 'framer-motion';

const COUNTRY_COLORS = {
  USA:    '#4FC3F7',
  USSR:   '#FF6B6B',
  India:  '#FF9800',
  China:  '#EF5350',
  Japan:  '#66BB6A',
  Israel: '#AB47BC',
};

function StatusBadge({ status }) {
  const cls =
    status === 'Success'         ? 'success'
    : status === 'Partial Success' ? 'partial'
    : status === 'Failed'          ? 'failed'
    : status === 'Operational'     ? 'operational'
    : 'partial';

  return (
    <span className={`mission-status-badge ${cls}`}>
      {status}
    </span>
  );
}

export default function MissionPanel({ mission, onClose }) {
  if (!mission) return null;

  const countryColor = COUNTRY_COLORS[mission.country] || '#4FC3F7';
  const hasCrew      = mission.crew && mission.crew.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        className="lunar-mission-panel"
        key={mission.id}
        initial={{ x: 360, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        exit={{ x: 360,    opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      >
        {/* Header */}
        <div className="mission-panel-header">
          <button className="mission-panel-close" onClick={onClose} title="Close">✕</button>

          <div className="mission-series-badge">
            {mission.flag} &nbsp; {mission.mission_series} Program
          </div>

          <h2 className="mission-panel-name">{mission.name}</h2>

          <div className="mission-panel-meta">
            <span
              className="mission-agency-badge"
              style={{ color: countryColor, borderColor: countryColor }}
            >
              {mission.agency}
            </span>
            <span className="mission-type-badge">{mission.type}</span>
            <StatusBadge status={mission.status} />
          </div>
        </div>

        {/* Body */}
        <div className="mission-panel-body">

          {/* Key Facts */}
          <div className="mission-detail-section">
            <h4>Mission Details</h4>

            <div className="mission-detail-row">
              <span className="mission-detail-key">Launch Date</span>
              <span className="mission-detail-val">{mission.date}</span>
            </div>
            <div className="mission-detail-row">
              <span className="mission-detail-key">Country</span>
              <span className="mission-detail-val" style={{ color: countryColor }}>
                {mission.flag} {mission.country}
              </span>
            </div>
            <div className="mission-detail-row">
              <span className="mission-detail-key">Year</span>
              <span className="mission-detail-val">{mission.year}</span>
            </div>
            <div className="mission-detail-row">
              <span className="mission-detail-key">Mission Type</span>
              <span className="mission-detail-val">{mission.type}</span>
            </div>
            <div className="mission-detail-row">
              <span className="mission-detail-key">Landing Site</span>
              <span className="mission-detail-val">{mission.landingSite}</span>
            </div>
            {mission.latitude !== 0 || mission.longitude !== 0 ? (
              <div className="mission-detail-row">
                <span className="mission-detail-key">Coordinates</span>
                <span className="mission-detail-val">
                  {mission.latitude.toFixed(2)}°, {mission.longitude.toFixed(2)}°
                </span>
              </div>
            ) : null}
          </div>

          {/* Mission Highlight */}
          <div className="mission-detail-section">
            <h4>Key Achievement</h4>
            <div className="mission-highlight-box">
              {mission.highlights}
            </div>
          </div>

          {/* Crew (if any) */}
          {hasCrew && (
            <div className="mission-detail-section">
              <h4>Crew ({mission.crew.length})</h4>
              <div className="mission-crew-list">
                {mission.crew.map((name, i) => (
                  <div key={i} className="mission-crew-member">
                    <div className="mission-crew-avatar">
                      {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    {name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Crew notice */}
          {!hasCrew && (
            <div className="mission-detail-section">
              <h4>Crew</h4>
              <div className="mission-detail-row">
                <span className="mission-detail-val" style={{ color: '#64748b', fontStyle: 'italic' }}>
                  Uncrewed / Robotic mission
                </span>
              </div>
            </div>
          )}

          {/* Series indicator */}
          <div className="mission-detail-section">
            <h4>Program</h4>
            <div className="mission-detail-row">
              <span className="mission-detail-key">Series</span>
              <span className="mission-detail-val" style={{ color: countryColor }}>
                {mission.mission_series}
              </span>
            </div>
            <div className="mission-detail-row">
              <span className="mission-detail-key">Agency</span>
              <span className="mission-detail-val">{mission.agency}</span>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
