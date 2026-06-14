const COUNTRIES = [
  { key: 'USA',    label: 'USA',    flag: '🇺🇸', color: '#4FC3F7', cls: 'usa'    },
  { key: 'USSR',   label: 'USSR',   flag: '🇷🇺', color: '#FF6B6B', cls: 'ussr'   },
  { key: 'India',  label: 'India',  flag: '🇮🇳', color: '#FF9800', cls: 'india'  },
  { key: 'China',  label: 'China',  flag: '🇨🇳', color: '#EF5350', cls: 'china'  },
  { key: 'Japan',  label: 'Japan',  flag: '🇯🇵', color: '#66BB6A', cls: 'japan'  },
  { key: 'Israel', label: 'Israel', flag: '🇮🇱', color: '#AB47BC', cls: 'israel' },
];

export default function CountryFilter({ allMissions, activeCountries, onToggle }) {
  return (
    <div className="lunar-filter-bar">
      <div className="lunar-filter-label">Filter by Country</div>
      <div className="lunar-filter-pills">
        {COUNTRIES.map(({ key, label, flag, color, cls }) => {
          const count  = allMissions.filter(m => m.country === key).length;
          const active = activeCountries.includes(key);
          return (
            <button
              key={key}
              className={`lunar-pill ${cls} ${active ? 'active' : ''}`}
              onClick={() => onToggle(key)}
              title={`${active ? 'Hide' : 'Show'} ${label} missions`}
            >
              <span
                className="lunar-pill-dot"
                style={{ background: active ? color : 'rgba(255,255,255,0.15)' }}
              />
              <span>{flag} {label}</span>
              <span className="lunar-pill-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
