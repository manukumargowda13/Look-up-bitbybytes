const { generateOrbitPath } = require('../services/issOrbitService');

const getOrbitPath = async (req, res, next) => {
  try {
    const data = await generateOrbitPath();
    res.status(200).json(data);
  } catch (error) {
    console.error('[ISS Orbit Controller Error]', error.message);
    res.status(503).json({
      success: false,
      error: 'Unable to compute ISS orbit path',
      message: error.message
    });
  }
};

module.exports = { getOrbitPath };
