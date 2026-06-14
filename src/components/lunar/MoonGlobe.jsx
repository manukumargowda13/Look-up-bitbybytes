import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import lunarMissions from '../../data/lunarMissions.json';

/* ── Coordinate Conversion ──────────────────────────────────── */
function latLonToXYZ(lat, lon, radius) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    z:  radius * Math.sin(phi) * Math.sin(theta),
    y:  radius * Math.cos(phi),
  };
}

/* ── Moon Sphere ────────────────────────────────────────────── */
function MoonMesh() {
  const meshRef = useRef();
  const texture = useTexture('/textures/moon.jpg');

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  );
}

/* ── Atmosphere Glow ─────────────────────────────────────────── */
function AtmosphereGlow() {
  return (
    <mesh>
      <sphereGeometry args={[5.18, 64, 64]} />
      <meshBasicMaterial
        color="#4fc3f7"
        transparent
        opacity={0.04}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/* ── Single Mission Marker ───────────────────────────────────── */
function MissionMarker({ mission, isSelected, isHovered, onClick, onHover, onUnhover }) {
  const meshRef  = useRef();
  const ringRef  = useRef();
  const pos      = latLonToXYZ(mission.latitude, mission.longitude, 5.18);
  const color    = new THREE.Color(mission.color);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isSelected) {
      meshRef.current.scale.setScalar(1.8 + Math.sin(t * 4) * 0.4);
    } else if (isHovered) {
      meshRef.current.scale.setScalar(1.4 + Math.sin(t * 6) * 0.2);
    } else {
      meshRef.current.scale.setScalar(1.0 + Math.sin(t * 2 + mission.latitude) * 0.12);
    }

    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.3);
      ringRef.current.material.opacity = isSelected ? 0.5 + Math.sin(t * 3) * 0.3 : 0;
    }
  });

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      {/* Glow ring for selected */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.16, 0.22, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main marker sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(mission); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(mission); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e)  => { e.stopPropagation(); onUnhover(); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 2.5 : isHovered ? 1.8 : 1.0}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Spike from surface */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.14, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ── Camera Controller ───────────────────────────────────────── */
function CameraController({ target, onReady }) {
  const { camera } = useThree();

  useEffect(() => {
    if (onReady) onReady(camera);
  }, [camera, onReady]);

  useEffect(() => {
    if (!target) return;
    const pos = latLonToXYZ(target.latitude, target.longitude, 13);
    gsap.to(camera.position, {
      duration: 2.2,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(0, 0, 0),
    });
  }, [target, camera]);

  return null;
}

/* ── Main Canvas Scene ───────────────────────────────────────── */
export default function MoonGlobe({ missions, selectedMission, onSelectMission, hoveredMission, onHoverMission, onUnhoverMission }) {
  const [cameraRef, setCameraRef] = useState(null);

  const handleCameraReady = useCallback((cam) => {
    setCameraRef(cam);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 3, 14], fov: 45, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[10, 8, 5]}
        intensity={1.4}
        color="#fff8f0"
      />
      <pointLight position={[-20, -10, -10]} intensity={0.08} color="#4fc3f7" />

      {/* Stars Background */}
      <Stars radius={120} depth={60} count={6000} factor={4} saturation={0.3} fade speed={0.5} />

      {/* Moon */}
      <MoonMesh />
      <AtmosphereGlow />

      {/* Mission Markers */}
      {missions.map((mission) => (
        <MissionMarker
          key={mission.id}
          mission={mission}
          isSelected={selectedMission?.id === mission.id}
          isHovered={hoveredMission?.id === mission.id}
          onClick={onSelectMission}
          onHover={onHoverMission}
          onUnhover={onUnhoverMission}
        />
      ))}

      {/* Camera FlyTo */}
      <CameraController target={selectedMission} onReady={handleCameraReady} />

      {/* Orbit Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={22}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        dampingFactor={0.07}
        enableDamping
      />
    </Canvas>
  );
}
