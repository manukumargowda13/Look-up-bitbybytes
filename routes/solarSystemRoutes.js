const express = require('express');
const router = express.Router();
const solarSystemController = require('../controllers/solarSystemController');

router.get('/planets', solarSystemController.getPlanets);
router.get('/body/:id', solarSystemController.getBody);

module.exports = router;
