const express = require('express');
const router = express.Router();
const { getISSLocation, getISSVisibilityPass } = require('../controllers/issController');
const { getOrbitPath } = require('../controllers/issOrbitController');
const { getCrew } = require('../controllers/issCrewController');

router.get('/', getISSLocation);
router.get('/crew', getCrew);
router.get('/visibility', getISSVisibilityPass);
router.get('/orbit', getOrbitPath);

module.exports = router;