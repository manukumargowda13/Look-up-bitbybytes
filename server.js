require('dotenv').config();

const express = require('express');
const cors = require('cors');

const issRoutes = require('./routes/issRoutes');
const satelliteRoutes = require('./routes/satelliteRoutes');
const nasaRoutes = require('./routes/nasaRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const activityRoutes = require('./routes/activityRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const visibilityRoutes = require('./routes/visibilityRoutes');
const locationRoutes = require('./routes/locationRoutes');
const spacexRoutes = require('./routes/spacexRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LOOK UP Backend Running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

const visibilityController = require('./controllers/visibilityController');

// API Routes
app.use('/api/iss', issRoutes);
app.use('/api/satellites', satelliteRoutes);
app.use('/api/nasa', nasaRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/ask', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/visibility', visibilityRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/spacex', spacexRoutes);

// Direct explicit endpoints mapping as requested
app.get('/api/location/:lat/:lng', visibilityController.getLocationInfo);
app.get('/api/astronomy/:lat/:lng', visibilityController.getMoonInfo);
app.get('/api/iss/passes/:lat/:lng', visibilityController.getISSVisibilityInfo);

// Global error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] ✓ Server running on port ${PORT}`);
  console.log('[ENV] API Keys Status:');
  console.log('  - OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? '✓ Configured' : '✗ Missing');
  console.log('  - N2YO_API_KEY:', process.env.N2YO_API_KEY ? '✓ Configured' : '✗ Missing');
  console.log('  - ASTRONOMY_API_KEY:', process.env.ASTRONOMY_API_KEY ? '✓ Configured' : '✗ Missing');
  console.log('  - NASA_API_KEY:', process.env.NASA_API_KEY ? '✓ Configured' : '✗ Missing');
  console.log('  - GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✓ Configured' : '✗ Missing');
});