const fs = require('fs');
const path = require('path');
const axios = require('axios');

const CACHE_FILE = path.join(__dirname, '../data/iss-crew-cache.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CREW_API =
  'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json';

const ensureDataDir = () => {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const readCache = () => {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    const age = Date.now() - new Date(data.lastUpdated).getTime();
    if (age > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  ensureDataDir();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
};

const fetchISSCrew = async () => {
  const response = await axios.get(CREW_API, { timeout: 10000 });
  const crew = response.data.people.filter(
    (person) => person.craft === 'ISS' || person.iss === true
  );

  return {
    success: true,
    count: crew.length,
    astronauts: crew.map((person, index) => ({
      number: index + 1,
      name: person.name
    })),
    lastUpdated: new Date().toISOString()
  };
};

const getISSCrew = async () => {
  const cached = readCache();
  if (cached) {
    return cached;
  }

  const fresh = await fetchISSCrew();
  writeCache(fresh);
  return fresh;
};

const refreshCrewCacheIfNeeded = async () => {
  try {
    const cached = readCache();
    if (cached) {
      console.log(`[ISS Crew] Serving from cache (${cached.count} astronauts)`);
      return cached;
    }

    const fresh = await fetchISSCrew();
    writeCache(fresh);
    console.log(`[ISS Crew] Cache refreshed (${fresh.count} astronauts)`);
    return fresh;
  } catch (error) {
    console.error('[ISS Crew] Cache refresh failed:', error.message);

    try {
      if (fs.existsSync(CACHE_FILE)) {
        const stale = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        console.log('[ISS Crew] Using stale cache after refresh failure');
        return stale;
      }
    } catch {
      // fall through
    }

    throw error;
  }
};

module.exports = { getISSCrew, fetchISSCrew, refreshCrewCacheIfNeeded };
