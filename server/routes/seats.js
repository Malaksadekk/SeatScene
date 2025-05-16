const express = require('express');
const router = express.Router();
const Movie = require('../models/SeatLayout');

// Get seat layout for a movie
router.get('/layout', async (req, res) => {
  try {
    const { movieId } = req.query;
    
    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({
      seats: movie.seating.seats,
      prices: {
        regular: movie.seating.regularPrice,
        vip: movie.seating.vipPrice
      },
      unavailableSeats: movie.seating.unavailableSeats,
      vipRows: movie.seating.vipRows
    });
  } catch (error) {
    console.error('Error fetching seat layout:', error);
    res.status(500).json({ error: 'Failed to fetch seat layout' });
  }
});

module.exports = router; 