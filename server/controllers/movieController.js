const Movie = require('../models/Movie');

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single movie
exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      posterUrl: req.body.posterUrl,
      capacity: req.body.capacity,
      screenType: req.body.screenType,
      amenities: req.body.amenities || []
    });

    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Update all fields
    movie.title = req.body.title || movie.title;
    movie.description = req.body.description || movie.description;
    movie.duration = req.body.duration || movie.duration;
    movie.genre = req.body.genre || movie.genre;
    movie.releaseDate = req.body.releaseDate || movie.releaseDate;
    movie.posterUrl = req.body.posterUrl || movie.posterUrl;
    movie.capacity = req.body.capacity || movie.capacity;
    movie.screenType = req.body.screenType || movie.screenType;
    movie.amenities = req.body.amenities || movie.amenities;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await movie.deleteOne();
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



