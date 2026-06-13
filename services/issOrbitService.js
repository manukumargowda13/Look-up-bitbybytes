const fs = require('fs');
const path = require('path');
const axios = require('axios');
const satellite = require('satellite.js');

const TLE_CACHE_FILE = path.join(__dirname, '../data/iss-tle-cache.json');
const TLE_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const TLE_URL = 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE';
const ORBIT_DURATION_MINUTES = 90;
const ORBIT_STEP_SECONDS = 30;

const ensureDataDir = () => {
  const dir = path.dirname(TLE_CACHE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const readTLECache = () => {
  try {
    if (!fs.existsSync(TLE_CACHE_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(TLE_CACHE_FILE, 'utf8'));
    const age = Date.now() - new Date(data.lastUpdated).getTime();
    if (age > TLE_CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
};

const writeTLECache = (line1, line2, name) => {
  ensureDataDir();
  fs.writeFileSync(
    TLE_CACHE_FILE,
    JSON.stringify(
      {
        name,
        line1,
        line2,
        lastUpdated: new Date().toISOString()
      },
      null,
      2
    )
  );
};

const fetchTLE = async () => {
  const cached = readTLECache();
  if (cached) {
    return cached;
  }

  const response = await axios.get(TLE_URL, { timeout: 10000 });
  const lines = response.data
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 3) {
    throw new Error('Invalid TLE response from CelesTrak');
  }

  const tle = {
    name: lines[0],
    line1: lines[1],
    line2: lines[2],
    lastUpdated: new Date().toISOString()
  };

  writeTLECache(tle.line1, tle.line2, tle.name);
  return tle;
};

const propagatePosition = (satrec, date) => {
  const positionAndVelocity = satellite.propagate(satrec, date);
  if (!positionAndVelocity || !positionAndVelocity.position) {
    return null;
  }

  const gmst = satellite.gstime(date);
  const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

  return {
    lat: satellite.degreesLat(positionGd.latitude),
    lng: satellite.degreesLong(positionGd.longitude),
    alt: positionGd.height
  };
};

const generateOrbitPath = async () => {
  const tle = await fetchTLE();
  const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
  const now = new Date();
  const totalSteps = (ORBIT_DURATION_MINUTES * 60) / ORBIT_STEP_SECONDS;
  const points = [];

  for (let i = 0; i <= totalSteps; i++) {
    const time = new Date(now.getTime() + i * ORBIT_STEP_SECONDS * 1000);
    const position = propagatePosition(satrec, time);
    if (!position) continue;

    points.push({
      lat: position.lat,
      lng: position.lng,
      alt: Math.round(position.alt * 10) / 10,
      time: time.toISOString()
    });
  }

  const currentPosition = propagatePosition(satrec, now);

  return {
    success: true,
    name: tle.name,
    noradId: 25544,
    durationMinutes: ORBIT_DURATION_MINUTES,
    pointCount: points.length,
    currentPosition: currentPosition
      ? {
          lat: currentPosition.lat,
          lng: currentPosition.lng,
          alt: Math.round(currentPosition.alt * 10) / 10,
          time: now.toISOString()
        }
      : null,
    points,
    lastUpdated: now.toISOString()
  };
};

module.exports = { generateOrbitPath, fetchTLE };
