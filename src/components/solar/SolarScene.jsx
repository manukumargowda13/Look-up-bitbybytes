import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import Sun from './Sun';
import Planet from './Planet';
import OrbitRing from './OrbitRing';
import Starfield from './Starfield';

const EARTH_REAL_RADIUS_KM = 6371;
const EARTH_VISUAL_RADIUS = 2.1;
const PLANET_SIZE_EXPONENT = 0.62;
const MIN_PLANET_RADIUS = 0.82;
const ORBIT_SPEED_BASE = 0.004;

const getVisualRadius = (meanRadius) => {
  if (!meanRadius) return MIN_PLANET_RADIUS;
  const earthRelativeRadius = meanRadius / EARTH_REAL_RADIUS_KM;
  const scaledRadius = EARTH_VISUAL_RADIUS * Math.pow(earthRelativeRadius, PLANET_SIZE_EXPONENT);
  return Math.max(MIN_PLANET_RADIUS, scaledRadius);
};

const getVisualOrbitRadius = (distanceFromSun, index) => {
  if (!distanceFromSun || distanceFromSun === 0) return 8 + index * 6;
  const logDist = Math.log10(distanceFromSun / 57909050 + 1);
  return 7 + logDist * 38 + index * 1.5;
};

const getOrbitSpeed = (sideralOrbit, speedMultiplier) => {
  if (!sideralOrbit || sideralOrbit <= 0) return ORBIT_SPEED_BASE * speedMultiplier;
  return (ORBIT_SPEED_BASE / (sideralOrbit / 365.25)) * speedMultiplier;
};

const getRotationSpeed = (sideralRotation, speedMultiplier) => {
  if (!sideralRotation) return 0.003 * speedMultiplier;
  const absRot = Math.abs(sideralRotation);
  const direction = sideralRotation < 0 ? -1 : 1;
  return direction * (0.003 / (absRot / 23.934)) * speedMultiplier;
};

const CameraController = ({ target, controlsRef, planetPositionsRef, resetKey }) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 60, 120));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (target === undefined) {
      targetPos.current.set(0, 60, 120);
      targetLook.current.set(0, 0, 0);
    } else if (target === null) {
      targetPos.current.set(0, 34, 48);
      targetLook.current.set(0, 0, 0);
    }
  }, [target, resetKey]);

  useFrame(() => {
    if (target && planetPositionsRef.current[target.id]) {
      const { position, radius } = planetPositionsRef.current[target.id];
      const offset = new THREE.Vector3(
        Math.max(radius * 3.8, 3.5),
        Math.max(radius * 2.2, 2.2),
        Math.max(radius * 5.2, 5.5)
      );
      targetLook.current.copy(position);
      targetPos.current.copy(position).add(offset);
    }

    camera.position.lerp(targetPos.current, 0.04);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, 0.04);
      controlsRef.current.update();
    }
  });

  return null;
};

const NebulaGlow = () => (
  <>
    <ambientLight intensity={0.22} color="#9fc7ff" />
    <hemisphereLight skyColor="#d7efff" groundColor="#0a1024" intensity={0.35} />
    <directionalLight position={[40, 32, 24]} color="#ffffff" intensity={0.72} />
  </>
);

const INITIAL_ANGLES = [0.2, 0.8, 1.5, 2.3, 3.1, 4.2, 5.0, 5.8];

const SolarScene = ({
  planets,
  selectedPlanet,
  onPlanetClick,
  onSunClick,
  paused,
  speedMultiplier,
  searchQuery,
}) => {
  const controlsRef = useRef();
  const planetPositionsRef = useRef({});

  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: '#010208' }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      <PerspectiveCamera makeDefault fov={55} near={0.1} far={2000} position={[0, 60, 120]} />

      <CameraController
        target={selectedPlanet}
        controlsRef={controlsRef}
        planetPositionsRef={planetPositionsRef}
        resetKey={selectedPlanet?.id}
      />

      <NebulaGlow />

      <Suspense fallback={null}>
        <Starfield count={7000} />

        <Sun
          onClick={() => onSunClick && onSunClick()}
          isSelected={selectedPlanet === null}
        />

        {planets.map((planet, index) => {
          const visualRadius = getVisualRadius(planet.meanRadius);
          const orbitRadius = getVisualOrbitRadius(planet.distanceFromSun, index);
          const orbitSpeed = getOrbitSpeed(planet.sideralOrbit, speedMultiplier);
          const rotationSpeed = getRotationSpeed(planet.sideralRotation, speedMultiplier);
          const isSelected = selectedPlanet?.id === planet.id;
          const isHighlighted = Boolean(searchQuery && planet.name.toLowerCase().includes(searchQuery.toLowerCase()));

          return (
            <group key={planet.id}>
              <OrbitRing
                radius={orbitRadius}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
              />
              <Planet
                planetId={planet.id}
                radius={visualRadius}
                orbitRadius={orbitRadius}
                orbitSpeed={orbitSpeed}
                rotationSpeed={rotationSpeed}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                onClick={() => onPlanetClick(planet)}
                onPositionChange={(position) => {
                  planetPositionsRef.current[planet.id] = { position: position.clone(), radius: visualRadius };
                }}
                initialAngle={INITIAL_ANGLES[index] || index * 0.8}
                paused={paused}
              />
            </group>
          );
        })}
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.5}
        minDistance={4}
        maxDistance={400}
        enablePan
      />
    </Canvas>
  );
};

export default SolarScene;
