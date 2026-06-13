const express = require('express');
const router = express.Router();
const { getCrew } = require('../controllers/issCrewController');

router.get('/', getCrew);

module.exports = router;
