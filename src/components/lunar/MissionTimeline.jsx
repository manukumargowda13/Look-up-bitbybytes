const MIN_YEAR = 1959;
const MAX_YEAR = 2024;

export default function MissionTimeline({ allMissions, currentYear, onYearChange, selectedMission, onSelectMission }) {
  const pct = ((currentYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  // Group missions by year for dots
  const missionsByYear = {};
  allMissions.forEach(m => {
    if (!missionsByYear[m.year]) missionsByYear[m.year] = [];
    missionsByYear[m.year].push(m);
  });

  const visibleCount = allMissions.filter(m => m.year <= currentYear).length;

  return (
    <div className="lunar-timeline">
      <div className="timeline-header">
        <span className="timeline-title">Mission Timeline</span>
        <span className="timeline-year-display">{currentYear}</span>
      </div>

      <div className="timeline-track-wrap">
        <div className="timeline-track">
          <div className="timeline-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Year-based dots */}
        <div className="timeline-dots">
          {Object.entries(missionsByYear).map(([year, missions]) => {
            const yNum   = parseInt(year);
            const dotPct = ((yNum - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
            const active = yNum <= currentYear;
            // Use first mission's color as dot color
            const dotColor = missions[0].color;

            return (
              <div
                key={year}
                className={`timeline-dot ${selectedMission && missions.some(m => m.id === selectedMission.id) ? 'selected' : ''}`}
                style={{
                  left: `${dotPct}%`,
                  background: active ? dotColor : 'rgba(255,255,255,0.15)',
                  color: dotColor,
                  opacity: active ? 1 : 0.3,
                }}
                title={missions.map(m => m.name).join(', ')}
                onClick={() => {
                  onYearChange(yNum);
                  if (missions.length === 1) onSelectMission(missions[0]);
                  else onSelectMission(missions[0]);
                }}
              />
            );
          })}
        </div>

        {/* Invisible input for drag */}
        <input
          type="range"
          className="timeline-input"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={currentYear}
          onChange={e => onYearChange(Number(e.target.value))}
        />
      </div>

      <div className="timeline-labels">
        <span className="timeline-label">{MIN_YEAR}</span>
        {[1970, 1980, 1990, 2000, 2010, 2020].map(y => (
          <span key={y} className="timeline-label">{y}</span>
        ))}
        <span className="timeline-label">{MAX_YEAR}</span>
      </div>

      <div className="timeline-mission-count">
        <span style={{ color: '#4fc3f7', fontWeight: 700 }}>{visibleCount}</span>
        &nbsp;of {allMissions.length} missions visible
      </div>
    </div>
  );
}
