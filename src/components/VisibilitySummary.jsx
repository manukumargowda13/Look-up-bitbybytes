import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Cloud, Moon, Zap, AlertCircle } from 'lucide-react';

const VisibilitySummary = ({ location, onClose }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE || '';
        const response = await fetch(
          `${baseUrl}/api/visibility/summary?latitude=${location.latitude}&longitude=${location.longitude}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch visibility summary: ${response.status} ${response.statusText} ${errorText}`);
        }

        const data = await response.json();
        setSummary(data.data ?? data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchSummary();
    }
  }, [location]);

  if (!location) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        background: 'linear-gradient(180deg, rgba(11,12,28,0.8), rgba(8,9,20,0.6))',
        border: '1px solid rgba(34, 211, 238, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: '#22d3ee', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={20} />
          Tonight from {location.city}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(124, 58, 237, 0.2)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '6px',
            padding: '6px 12px',
            color: '#cbd5e1',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Close
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
          <div>Loading visibility data...</div>
        </div>
      ) : error ? (
        <div style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px' }}>
          <AlertCircle size={16} style={{ marginRight: '8px' }} />
          {error}
        </div>
      ) : summary ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Visible Objects */}
          {summary.visibleObjects && summary.visibleObjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                padding: '12px',
                background: 'rgba(34, 211, 238, 0.05)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '8px'
              }}
            >
              <div style={{ color: '#22d3ee', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                VISIBLE TONIGHT:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {summary.visibleObjects.map((obj, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(34, 211, 238, 0.15)',
                      color: '#22d3ee',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {obj}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ISS Next Pass */}
          {summary.detailedData?.iss?.nextPass && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              style={{
                padding: '12px',
                background: 'rgba(250, 204, 21, 0.05)',
                border: '1px solid rgba(250, 204, 21, 0.2)',
                borderRadius: '8px'
              }}
            >
              <div style={{ color: '#fde047', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                NEXT ISS PASS:
              </div>
              <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 600 }}>
                {new Date(summary.detailedData.iss.nextPass.startTime).toLocaleString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '4px' }}>
                Duration: {summary.detailedData.iss.nextPass.duration} min
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '2px' }}>
                Visibility: {summary.detailedData.iss.nextPass.visibility}
              </div>
            </motion.div>
          )}

          {/* Best Viewing Window */}
          {summary.bestViewingWindow && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                padding: '12px',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px'
              }}
            >
              <div style={{ color: '#d8b4fe', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                BEST VIEWING WINDOW:
              </div>
              <div style={{ color: '#f8fafc' }}>
                {new Date(summary.bestViewingWindow.startTime).toLocaleTimeString()} - {' '}
                {new Date(summary.bestViewingWindow.endTime).toLocaleTimeString()}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '4px' }}>
                Duration: {summary.bestViewingWindow.duration} minutes
              </div>
            </motion.div>
          )}

          {/* Observation Conditions */}
          {summary.detailedData?.conditions && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                padding: '12px',
                background: 'rgba(34, 211, 238, 0.05)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '8px'
              }}
            >
              <div style={{ color: '#22d3ee', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cloud size={16} />
                CONDITIONS:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Cloud Cover:</span>
                  <span style={{ color: '#f8fafc', marginLeft: '6px' }}>{Math.round(summary.detailedData.conditions.cloudCover)}%</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Rating:</span>
                  <span style={{ color: '#f8fafc', marginLeft: '6px' }}>{summary.observationRating}</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Moon Illumination:</span>
                  <span style={{ color: '#f8fafc', marginLeft: '6px' }}>{Math.round(summary.moonIllumination)}%</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Duration:</span>
                  <span style={{ color: '#f8fafc', marginLeft: '6px' }}>{summary.recommendedDuration}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recommendation */}
          {summary.recommendation && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: '12px',
                background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(34, 211, 238, 0.1))',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px'
              }}
            >
              <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {summary.recommendation}
              </div>
            </motion.div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default VisibilitySummary;
