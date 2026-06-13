const axios = require('axios');

// Reverse geocode using Nominatim (free, no API key required)
const getLocationDetails = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'LOOK UP Space Intelligence Platform',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }
    );

    const data = response.data;
    return {
      latitude,
      longitude,
      country: data.address?.country || 'Unknown',
      city: data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown',
      timezone: await getTimezoneForLocation(latitude, longitude),
      displayName: data.display_name || 'Unknown Location'
    };
  } catch (error) {
    console.error('[Location Error]', error.message);
    throw new Error(`Failed to get location details: ${error.message}`);
  }
};

// Get timezone using GeoNames API (requires free account - alternative: use simple offset)
const getTimezoneForLocation = async (latitude, longitude) => {
  try {
    const apiKey = process.env.ASTRONOMY_API_KEY;
    if (!apiKey) {
      const tzOffset = Math.round(longitude / 15);
      const sign = tzOffset >= 0 ? '+' : '';
      return `UTC${sign}${tzOffset}`;
    }

    const response = await axios.get(
      `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&lat=${latitude}&long=${longitude}`,
      { timeout: 10000 }
    );

    return response.data?.timezone || response.data?.timezone_name || 'UTC';
  } catch (error) {
    return 'UTC';
  }
};

module.exports = { getLocationDetails, getTimezoneForLocation };
