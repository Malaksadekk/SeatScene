const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Booking = require('../models/Booking');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [users, movies, theaters, tickets] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Theater.countDocuments(),
      Booking.countDocuments()
    ]);
    res.json({ users, movies, theaters, tickets });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// User management routes
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Movie management routes
router.get('/movies', adminController.getMovies);
router.post('/movies', adminController.createMovie);
router.put('/movies/:id', adminController.updateMovie);
router.delete('/movies/:id', adminController.deleteMovie);

// Theater management routes
router.get('/theaters', adminController.getTheaters);
router.post('/theaters', adminController.createTheater);
router.put('/theaters/:id', adminController.updateTheater);
router.delete('/theaters/:id', adminController.deleteTheater);

// Ticket management routes
router.get('/tickets', adminController.getTickets);
router.put('/tickets/:id', adminController.updateTicket);
router.delete('/tickets/:id', adminController.deleteTicket);

module.exports = router;
