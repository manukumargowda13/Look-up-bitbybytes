import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const seededRandom = (index) => {
  const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const Starfield = ({ count = 8000 }) => {
  const pointsRef = useRef();

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const starColors = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffe8d6'),
      new THREE.Color('#d6e4ff'),
      new THREE.Color('#ffd6e8'),
      new THREE.Color('#d6fff0'),
      new THREE.Color('#fff5d6'),
    ];

    for (let i = 0; i < count; i++) {
      const r = 400 + seededRandom(i * 5 + 1) * 400;
      const theta = seededRandom(i * 5 + 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 5 + 3) - 1);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = starColors[Math.floor(seededRandom(i * 5 + 4) * starColors.length)];
      colors[i * 3]     = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = seededRandom(i * 5 + 5) * 2 + 0.5;
    }

    return [positions, colors, sizes];
  }, [count]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.002;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

export default Starfield;
