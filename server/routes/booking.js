const express = require('express');
const router = express.Router();
const Movie = require('../models/SeatLayout');

// Book seats
router.post('/', async (req, res) => {
  try {
    const { userId, movieId, seats, totalAmount } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Check if seats are available
    const unavailable = seats.some(seatId => 
      movie.seating.unavailableSeats.includes(seatId)
    );
    
    if (unavailable) {
      return res.status(409).json({ error: 'Some seats are already taken' });
    }

    // Mark seats as unavailable
    movie.seating.unavailableSeats.push(...seats);
    await movie.save();

    res.json({ 
      success: true, 
      message: 'Seats booked successfully',
      seats: seats
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book seats' });
  }
});

module.exports = router;
