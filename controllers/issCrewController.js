const { getISSCrew } = require('../services/issCrewService');

const getCrew = async (req, res, next) => {
  try {
    const data = await getISSCrew();
    res.status(200).json(data);
  } catch (error) {
    console.error('[ISS Crew Controller Error]', error.message);
    res.status(503).json({
      success: false,
      error: 'Unable to fetch ISS crew data',
      message: error.message
    });
  }
};

module.exports = { getCrew };
