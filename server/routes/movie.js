const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Get all movies
router.get('/', movieController.getMovies);

// Get a single movie
router.get('/:id', movieController.getMovie);

// Create a new movie
router.post('/', movieController.createMovie);

// Update a movie
router.put('/:id', movieController.updateMovie);

// Delete a movie
router.delete('/:id', movieController.deleteMovie);

module.exports = router;



