import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const PLANET_ID_ALIASES = {
  mercure: 'mercury',
  venus: 'venus',
  terre: 'earth',
  mars: 'mars',
  jupiter: 'jupiter',
  saturne: 'saturn',
  uranus: 'uranus',
  neptune: 'neptune',
};

const normalizePlanet = (planet) => {
  const rawId = String(planet.id || '').toLowerCase();
  const id = PLANET_ID_ALIASES[rawId] || String(planet.name || rawId).toLowerCase().replace(/\s+/g, '-');
  return { ...planet, id };
};

// Fallback data in case the API is unavailable
const FALLBACK_PLANETS = [
  {
    id: 'mercury', name: 'Mercury', meanRadius: 2439.7, gravity: 3.7,
    mass: { massValue: 3.3011, massExponent: 23 }, density: 5.427,
    sideralOrbit: 87.969, sideralRotation: 1407.6, distanceFromSun: 57909050,
    semimajorAxis: 57909050, moons: 0, avgTemp: 440,
    eccentricity: 0.2056, inclination: 7.005
  },
  {
    id: 'venus', name: 'Venus', meanRadius: 6051.8, gravity: 8.87,
    mass: { massValue: 4.8675, massExponent: 24 }, density: 5.243,
    sideralOrbit: 224.701, sideralRotation: -5832.5, distanceFromSun: 108208930,
    semimajorAxis: 108208930, moons: 0, avgTemp: 737,
    eccentricity: 0.0068, inclination: 3.395
  },
  {
    id: 'earth', name: 'Earth', meanRadius: 6371, gravity: 9.807,
    mass: { massValue: 5.9724, massExponent: 24 }, density: 5.515,
    sideralOrbit: 365.25, sideralRotation: 23.934, distanceFromSun: 149597870,
    semimajorAxis: 149597870, moons: 1, avgTemp: 288,
    eccentricity: 0.0167, inclination: 0.001
  },
  {
    id: 'mars', name: 'Mars', meanRadius: 3389.5, gravity: 3.721,
    mass: { massValue: 6.4171, massExponent: 23 }, density: 3.9335,
    sideralOrbit: 686.971, sideralRotation: 24.623, distanceFromSun: 227936640,
    semimajorAxis: 227936640, moons: 2, avgTemp: 210,
    eccentricity: 0.0935, inclination: 1.852
  },
  {
    id: 'jupiter', name: 'Jupiter', meanRadius: 69911, gravity: 24.79,
    mass: { massValue: 1.8982, massExponent: 27 }, density: 1.326,
    sideralOrbit: 4332.589, sideralRotation: 9.925, distanceFromSun: 778412020,
    semimajorAxis: 778412020, moons: 95, avgTemp: 165,
    eccentricity: 0.0489, inclination: 1.304
  },
  {
    id: 'saturn', name: 'Saturn', meanRadius: 58232, gravity: 10.44,
    mass: { massValue: 5.6834, massExponent: 26 }, density: 0.687,
    sideralOrbit: 10759.22, sideralRotation: 10.656, distanceFromSun: 1426725400,
    semimajorAxis: 1426725400, moons: 146, avgTemp: 134,
    eccentricity: 0.0565, inclination: 2.485
  },
  {
    id: 'uranus', name: 'Uranus', meanRadius: 25362, gravity: 8.87,
    mass: { massValue: 8.6810, massExponent: 25 }, density: 1.271,
    sideralOrbit: 30688.5, sideralRotation: -17.24, distanceFromSun: 2870972200,
    semimajorAxis: 2870972200, moons: 28, avgTemp: 76,
    eccentricity: 0.0457, inclination: 0.773
  },
  {
    id: 'neptune', name: 'Neptune', meanRadius: 24622, gravity: 11.15,
    mass: { massValue: 1.02413, massExponent: 26 }, density: 1.638,
    sideralOrbit: 60182, sideralRotation: 16.11, distanceFromSun: 4498252900,
    semimajorAxis: 4498252900, moons: 16, avgTemp: 72,
    eccentricity: 0.0113, inclination: 1.77
  },
];

export const usePlanetData = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/api/solar/planets`);
        if (response.data.success && response.data.data.length > 0) {
          setPlanets(response.data.data.map(normalizePlanet));
        } else {
          setPlanets(FALLBACK_PLANETS);
        }
      } catch (err) {
        console.warn('Solar API unavailable, using fallback data:', err.message);
        setPlanets(FALLBACK_PLANETS);
        setError('Using offline planetary data');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanets();
  }, []);

  return { planets, loading, error };
};
