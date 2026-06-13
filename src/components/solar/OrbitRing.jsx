import { useMemo } from 'react';
import * as THREE from 'three';

const OrbitRing = ({ radius, isHighlighted = false, isSelected = false }) => {
  const points = useMemo(() => {
    const pts = [];
    const segments = 256;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  const opacity = isSelected ? 0.9 : isHighlighted ? 0.45 : 0.12;
  const color = isSelected ? '#22d3ee' : isHighlighted ? '#7c3aed' : '#4a5568';

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </line>
  );
};

export default OrbitRing;
