/* global require, process, module */

const axios = require('axios');

const SOLAR_API_BASE = 'https://api.le-systeme-solaire.net/rest';
const API_KEY = process.env.SOLAR_SYSTEM_API_KEY || 'd4d35029-939a-490f-9c13-3f139355b6ba';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

const PLANET_DISTANCES_KM = {
  mercury: 57909050,
  venus: 108208930,
  earth: 149597870,
  mars: 227936640,
  jupiter: 778412020,
  saturn: 1426725400,
  uranus: 2870972200,
  neptune: 4498252900,
};

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

const normalizePlanetId = (planet) => {
  const rawId = String(planet.id || '').toLowerCase();
  if (PLANET_ID_ALIASES[rawId]) return PLANET_ID_ALIASES[rawId];
  return String(planet.englishName || rawId).toLowerCase().replace(/\s+/g, '-');
};

const formatPlanet = (planet) => {
  const id = normalizePlanetId(planet);

  return {
    id,
    apiId: planet.id,
    name: planet.englishName,
    meanRadius: planet.meanRadius,
    gravity: planet.gravity,
    mass: planet.mass,
    density: planet.density,
    sideralOrbit: planet.sideralOrbit,
    sideralRotation: planet.sideralRotation,
    semimajorAxis: planet.semimajorAxis,
    distanceFromSun: PLANET_DISTANCES_KM[id] || planet.semimajorAxis,
    moons: planet.moons ? planet.moons.length : 0,
    avgTemp: planet.avgTemp,
    eccentricity: planet.eccentricity,
    inclination: planet.inclination,
    discoveredBy: planet.discoveredBy,
    discoveryDate: planet.discoveryDate,
  };
};

const getPlanets = async (req, res) => {
  try {
    const response = await axios.get(
      `${SOLAR_API_BASE}/bodies?filter[]=isPlanet,eq,true&order=semimajorAxis,asc`,
      { headers }
    );

    const planets = response.data.bodies
      .filter(body => body.isPlanet)
      .map(formatPlanet)
      .sort((a, b) => a.distanceFromSun - b.distanceFromSun);

    res.json({ success: true, data: planets });
  } catch (err) {
    console.error('Solar system API error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getBody = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${SOLAR_API_BASE}/bodies/${id}`, { headers });
    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error('Solar body API error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getPlanets, getBody };
