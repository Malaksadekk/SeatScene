const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all theaters
router.get('/', authenticate, adminController.getTheaters);

// Create a new theater (admin only)
router.post('/', authenticate, isAdmin, adminController.createTheater);

// Update a theater (admin only)
router.put('/:id', authenticate, isAdmin, adminController.updateTheater);

// Delete a theater (admin only)
router.delete('/:id', authenticate, isAdmin, adminController.deleteTheater);

module.exports = router; 