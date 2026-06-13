import { useNavigate } from 'react-router-dom';
import { Orbit, ExternalLink } from 'lucide-react';

const SolarSystemViewer = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#e2e8f0',
      textAlign: 'center',
      gap: 12,
    }}>
      <Orbit size={32} color="#fcd34d" style={{ marginBottom: 8 }} />
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Solar System Overview</h3>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', padding: '0 10px' }}>
        {['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'].map(p => (
          <div key={p} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: 8, fontSize: '0.78rem' }}>
            {p}
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/solar-system')}
        style={{
          marginTop: 6,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          border: '1px solid rgba(34,211,238,0.45)',
          background: 'rgba(34,211,238,0.1)',
          color: '#67e8f9',
          borderRadius: 8,
          padding: '9px 13px',
          cursor: 'pointer',
          fontFamily: 'Courier New, monospace',
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontSize: '0.72rem',
        }}
      >
        Launch Explorer <ExternalLink size={14} />
      </button>
    </div>
  );
};

export default SolarSystemViewer;
