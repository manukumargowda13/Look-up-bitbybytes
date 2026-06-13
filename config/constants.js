module.exports = {
  OPEN_NOTIFY_API_URL: 'http://api.open-notify.org/iss-now.json',
  NASA_APOD_URL: 'https://api.nasa.gov/planetary/apod',
  NASA_NEO_URL: 'https://api.nasa.gov/neo/rest/v1/feed',
  N2YO_BASE_URL: 'https://api.n2yo.com/rest/v1/satellite',
  GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
  SAMPLE_SATELLITES: [
    { name: 'ISS', lat: 51.6, lng: -0.1, type: 'Space Station' },
    { name: 'Hubble', lat: 28.5, lng: -80.6, type: 'Telescope' },
    { name: 'Terra', lat: -3.2, lng: 135.2, type: 'Earth Observatory' },
    { name: 'NOAA-20', lat: 13.4, lng: 45.7, type: 'Meteorology' },
    { name: 'GPS IIF-10', lat: 40.7, lng: -65.1, type: 'Navigation' }
  ]
};
