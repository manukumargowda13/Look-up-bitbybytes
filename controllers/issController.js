const issService = require('../services/issService');
const { getISSVisibility } = require('../services/issVisibilityService');

const getISSLocation = async (req, res, next) => {
  try {
    const data = await issService.fetchISSLocation();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getISSVisibilityPass = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat ?? req.query.latitude);
    const lon = parseFloat(req.query.lon ?? req.query.longitude ?? req.query.lng);

    if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        error: 'Valid lat and lon query parameters are required'
      });
    }

    const issData = await getISSVisibility(lat, lon);

    if (!issData.nextPass) {
      return res.status(200).json({
        success: true,
        nextPass: null,
        message: issData.message || 'No upcoming ISS passes found'
      });
    }

    res.status(200).json({
      success: true,
      nextPass: {
        startTime: issData.nextPass.startTime,
        endTime: issData.nextPass.endTime,
        duration: issData.nextPass.duration,
        visibility: issData.nextPass.visibility,
        maxElevation: issData.nextPass.maxElevation
      }
    });
  } catch (error) {
    console.error('[ISS Visibility Endpoint Error]', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { getISSLocation, getISSVisibilityPass };