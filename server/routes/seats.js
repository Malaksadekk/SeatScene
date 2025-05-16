const express = require('express');
const router = express.Router();
const { getSeatLayout } = require('../controllers/seatsController');

router.get('/layout', getSeatLayout);

module.exports = router; 