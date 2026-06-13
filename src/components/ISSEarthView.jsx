import React from 'react';

const ISSEarthView = () => {
  const openStream = () => {
    window.open('https://eol.jsc.nasa.gov/esrs/hdev/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '8px' }}>
        Live Earth View from ISS
      </div>

      <button
        type="button"
        onClick={openStream}
        style={{
          width: '100%',
          borderRadius: '8px',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 47, 73, 0.9))',
          color: '#e0f2fe',
          padding: '12px 14px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'Courier New',
          fontSize: '0.95rem',
          boxShadow: '0 0 18px rgba(34, 211, 238, 0.08)'
        }}
      >
        Open the ISS Earth-view stream in a new tab
      </button>

      <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '8px' }}>
      </div>
    </div>
  );
};

export default ISSEarthView;
