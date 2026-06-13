import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

const TEXTURE_MAP = {
  mercury: '/textures/planets/8k_mercury.jpg',
  mercure: '/textures/planets/8k_mercury.jpg',
  venus: '/textures/planets/4k_venus_atmosphere.jpg',
  earth: '/textures/planets/8k_earth_daymap.jpg',
  terre: '/textures/planets/8k_earth_daymap.jpg',
  mars: '/textures/planets/8k_mars.jpg',
  jupiter: '/textures/planets/8k_jupiter.jpg',
  saturn: '/textures/planets/8k_saturn.jpg',
  saturne: '/textures/planets/8k_saturn.jpg',
  uranus: '/textures/planets/2k_uranus.jpg',
  neptune: '/textures/planets/2k_neptune.jpg',
};

const EMISSIVE_MAP = {
  mercury: '#1a0a00',
  mercure: '#1a0a00',
  venus: '#2a1500',
  earth: '#001a0d',
  terre: '#001a0d',
  mars: '#1a0500',
  jupiter: '#1a0e00',
  saturn: '#1a1200',
  saturne: '#1a1200',
  uranus: '#001a1a',
  neptune: '#00001a',
};

const LABEL_COLORS = {
  mercury: '#b0b0b0',
  mercure: '#b0b0b0',
  venus: '#e8c56a',
  earth: '#4a9eff',
  terre: '#4a9eff',
  mars: '#ff6030',
  jupiter: '#d4a060',
  saturn: '#e0c080',
  saturne: '#e0c080',
  uranus: '#7fffd4',
  neptune: '#4169e1',
};

const SaturnRings = ({ planetRadius }) => {
  const ringTexture = useLoader(TextureLoader, '/textures/planets/8k_saturn_ring_alpha.png');

  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0.2]}>
      <ringGeometry args={[planetRadius * 1.3, planetRadius * 2.4, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </mesh>
  );
};

const Planet = ({
  planetId,
  radius,
  orbitRadius,
  orbitSpeed,
  rotationSpeed,
  isSelected,
  isHighlighted,
  onClick,
  onPositionChange,
  initialAngle = 0,
  paused = false,
}) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const angleRef = useRef(initialAngle);
  const [hovered, setHovered] = useState(false);

  const texture = useLoader(TextureLoader, TEXTURE_MAP[planetId] || '/textures/planets/8k_earth_daymap.jpg');

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color(EMISSIVE_MAP[planetId] || '#000000'),
      emissiveIntensity: isSelected ? 0.65 : hovered ? 0.45 : 0.22,
      roughness: 0.68,
      metalness: 0.05,
    });
  }, [texture, planetId, isSelected, hovered]);

  useEffect(() => {
    angleRef.current = initialAngle;
  }, [initialAngle]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      if (!paused) {
        angleRef.current += delta * orbitSpeed * 60;
      }
      groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
      onPositionChange?.(groupRef.current.position);
    }

    if (meshRef.current && !paused) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  const labelColor = LABEL_COLORS[planetId] || '#ffffff';
  const hitRadius = Math.max(radius * 1.8, 0.34);

  return (
    <group ref={groupRef}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[hitRadius, 24, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh
        ref={meshRef}
        material={material}
        onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>

      {(planetId === 'saturn' || planetId === 'saturne') && <SaturnRings planetRadius={radius} />}

      {(hovered || isSelected || isHighlighted) && (
        <mesh>
          <sphereGeometry args={[radius * 1.15, 32, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#22d3ee' : labelColor}
            transparent
            opacity={isSelected ? 0.12 : 0.07}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.4, radius * 0.04, 8, 128]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

export default Planet;
