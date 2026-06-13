import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SunCorona = () => {
  const coronaRef = useRef();
  useFrame(({ clock }) => {
    if (coronaRef.current) {
      coronaRef.current.rotation.z = clock.getElapsedTime() * 0.05;
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.04;
      coronaRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={coronaRef}>
      <sphereGeometry args={[19.5, 32, 32]} />
      <meshBasicMaterial color="#ff6600" transparent opacity={0.08} side={THREE.BackSide} />
    </mesh>
  );
};

const Sun = ({ onClick, isSelected }) => {
  const sunRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2.0) * 0.025;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const sunMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FDB813'),
      emissive: new THREE.Color('#FF6000'),
      emissiveIntensity: 2.1,
      roughness: 0.7,
      metalness: 0.0,
    });
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Sun core */}
      <mesh
        ref={sunRef}
        material={sunMaterial}
        onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[13.5, 96, 96]} />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[15.2, 48, 48]} />
        <meshBasicMaterial color="#FF8800" transparent opacity={0.14} side={THREE.BackSide} />
      </mesh>

      {/* Outer corona */}
      <SunCorona />

      {/* Halo ring */}
      <mesh>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial color="#FF4400" transparent opacity={0.026} side={THREE.BackSide} />
      </mesh>

      {/* Point light at center */}
      <pointLight color="#FFF5E0" intensity={6} distance={900} decay={1} />
      <pointLight color="#FFB45C" intensity={2.5} distance={520} decay={1} />

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[15.4, 0.14, 8, 128]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
};

export default Sun;
