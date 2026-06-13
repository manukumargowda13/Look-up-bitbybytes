import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Satellite } from 'lucide-react';
import { SatelliteContext } from '../context/SatelliteContext';
import ISSEarthView from './ISSEarthView';

const DEFAULT_LOCATION = { lat: 11.6643, lon: 78.1460, label: 'Salem, India' };

const statusColor = (s) => {
  if (!s) return '#94a3b8';
  if (s === 'ONLINE' || s === 'Locked' || s === 'Open' || s === 'Nominal') return '#22c55e';
  if (s === 'OFFLINE' || s === 'Degraded' || s === 'Limited') return '#f59e0b';
  return '#ef4444';
};

const formatPassTime = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (isToday) return `Today ${timeStr}`;
  if (isTomorrow) return `Tomorrow ${timeStr}`;
  return date.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const getObservingCoords = (intelligenceData) => {
  if (!intelligenceData?.location) return DEFAULT_LOCATION;

  const loc = intelligenceData.location.data ?? intelligenceData.location;
  if (loc?.latitude != null && loc?.longitude != null) {
    const label = loc.city
      ? `${loc.city}${loc.country ? `, ${loc.country}` : ''}`
      : 'Selected location';
    return { lat: loc.latitude, lon: loc.longitude, label };
  }

  return DEFAULT_LOCATION;
};

const OrbitalPanel = () => {
  const { intelligenceData } = useContext(SatelliteContext);
  const [iss, setIss] = useState({ latitude: null, longitude: null, altitude: null, velocity: null });
  const [crew, setCrew] = useState(null);
  const [nextPass, setNextPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState('OFFLINE');
  const [lastUpdated, setLastUpdated] = useState(null);

  const coords = getObservingCoords(intelligenceData);

  const fetchISS = async () => {
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${baseUrl}/api/iss`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();

      setIss({
        latitude: data.latitude ?? data.lat ?? null,
        longitude: data.longitude ?? data.lng ?? data.lon ?? null,
        altitude: data.altitude ?? data.alt ?? null,
        velocity: data.velocity ?? data.vel ?? null
      });
      setTracking('ONLINE');
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('[ISS Fetch]', err.message || err);
      setError('Unable to reach ISS data');
      setTracking('OFFLINE');
    } finally {
      setLoading(false);
    }
  };

  const fetchCrew = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${baseUrl}/api/iss/crew`);
      if (!res.ok) throw new Error(`Crew API ${res.status}`);
      const data = await res.json();
      setCrew(data);
    } catch (err) {
      console.error('[ISS Crew]', err.message || err);
    }
  };

  const fetchVisibility = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(
        `${baseUrl}/api/iss/visibility?lat=${coords.lat}&lon=${coords.lon}`
      );
      if (!res.ok) throw new Error(`Visibility API ${res.status}`);
      const data = await res.json();
      setNextPass(data.nextPass ?? null);
    } catch (err) {
      console.error('[ISS Visibility]', err.message || err);
    }
  };

  useEffect(() => {
    fetchISS();
    fetchCrew();
    const iv = setInterval(fetchISS, 10000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    fetchVisibility();
    const iv = setInterval(fetchVisibility, 300000);
    return () => clearInterval(iv);
  }, [coords.lat, coords.lon]);

  const items = [
    { label: 'Latitude', value: iss.latitude != null ? iss.latitude.toFixed(4) : (loading ? 'Loading...' : '—') },
    { label: 'Longitude', value: iss.longitude != null ? iss.longitude.toFixed(4) : (loading ? 'Loading...' : '—') },
    { label: 'Altitude (km)', value: iss.altitude != null ? iss.altitude : (loading ? 'Loading...' : '—') },
    { label: 'Velocity (km/h)', value: iss.velocity != null ? iss.velocity : (loading ? 'Loading...' : '—') },
    { label: 'Last Updated', value: lastUpdated ? new Date(lastUpdated).toLocaleString() : (loading ? 'Loading...' : '—') }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid rgba(124,58,237,0.06)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.01), rgba(124,58,237,0.02))'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase' }}>ISS Status</div>
            <div style={{ color: '#f8fafc', fontSize: '1.2rem', fontFamily: 'Courier New', fontWeight: 700 }}>
              {tracking === 'ONLINE' ? 'Online' : 'Offline'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: statusColor(tracking),
                boxShadow: `0 0 8px ${statusColor(tracking)}`
              }}
            />
            <div style={{ color: statusColor(tracking), fontSize: '0.85rem', textTransform: 'uppercase' }}>
              {tracking}
            </div>
          </div>
        </div>
      </motion.div>

      {error ? (
        <div
          style={{
            padding: '10px',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.12)',
            borderRadius: 8,
            color: '#fecaca'
          }}
        >
          {error}
        </div>
      ) : null}

      {items.map((it, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.06 }}
          style={{
            padding: '12px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(124,58,237,0.02))',
            borderRadius: '8px',
            border: '1px solid rgba(124,58,237,0.06)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase' }}>{it.label}</div>
              <div style={{ color: '#f8fafc', fontSize: '1.05rem', fontFamily: 'Courier New', fontWeight: 700 }}>
                {it.value}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {crew && (
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            padding: '12px',
            background: 'rgba(34, 211, 238, 0.04)',
            borderRadius: '8px',
            border: '1px solid rgba(34, 211, 238, 0.15)'
          }}
        >
          <div
            style={{
              color: '#22d3ee',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Users size={14} />
            Crew aboard ISS ({crew.count})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {crew.astronauts?.map((astronaut) => (
              <div
                key={astronaut.number ?? astronaut.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#f8fafc',
                  fontSize: '0.9rem'
                }}
              >
                <span
                  style={{
                    color: '#22d3ee',
                    fontFamily: 'Courier New',
                    fontWeight: 700,
                    minWidth: '24px'
                  }}
                >
                  #{astronaut.number ?? '—'}
                </span>
                <span>{typeof astronaut === 'string' ? astronaut : astronaut.name}</span>
              </div>
            ))}
          </div>
          {crew.lastUpdated && (
            <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '8px' }}>
              Updated {new Date(crew.lastUpdated).toLocaleDateString()}
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          padding: '12px',
          background: 'rgba(139, 92, 246, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}
      >
        <div
          style={{
            color: '#d8b4fe',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Eye size={14} />
          Next visible pass — {coords.label}
        </div>
        {nextPass ? (
          <>
            <div style={{ color: '#f8fafc', fontSize: '1.05rem', fontFamily: 'Courier New', fontWeight: 700 }}>
              {formatPassTime(nextPass.startTime)}
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '6px' }}>
              Duration: {nextPass.duration} min
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '2px' }}>
              Visibility:{' '}
              <span
                style={{
                  color:
                    nextPass.visibility === 'Excellent'
                      ? '#22c55e'
                      : nextPass.visibility === 'Good'
                        ? '#22d3ee'
                        : '#f59e0b'
                }}
              >
                {nextPass.visibility}
              </span>
            </div>
          </>
        ) : (
          <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No upcoming passes found</div>
        )}
      </motion.div>

      <ISSEarthView />

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
        <div className="pulse-dot" />
        <span style={{ color: '#22d3ee', fontSize: '0.8rem', letterSpacing: '1px' }}>
          <Satellite size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          {tracking === 'ONLINE' ? 'TRACKING ONLINE' : 'TRACKING OFFLINE'}
        </span>
      </div>
    </div>
  );
};

export default OrbitalPanel;
