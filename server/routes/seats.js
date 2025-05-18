const express = require('express');
const router = express.Router();
const seatsController = require('../controllers/seatsController');

// Only handle movie seat layout
router.get('/layout', seatsController.getSeatLayout);

module.exports = router; 