const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Get all movies
router.get('/', movieController.getMovies);

// Get a single movie
router.get('/:id', movieController.getMovie);

// Get movies by genre
router.get('/genre/:genre', movieController.getMoviesByGenre);

// Get upcoming movies
router.get('/upcoming/all', movieController.getUpcomingMovies);

// Search movies
router.get('/search', movieController.searchMovies);

// Get movie showtimes with availability
router.get('/:id/showtimes', movieController.getMovieShowtimes);

// Note: Create, Update, and Delete operations are handled by admin routes
// as they require admin privileges and file upload handling

module.exports = router;



