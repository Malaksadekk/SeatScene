const Movie = require('../models/Movie');
const Booking = require('../models/Booking');

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    console.log('=== GET /api/movies ===');
    console.log('Fetching all movies from database...');
    
    const movies = await Movie.find()
      .select('title description duration genre releaseDate posterPath capacity screenType amenities showtimes createdAt')
      .lean();

    console.log('Raw movies from database:', movies);

    if (!movies || !Array.isArray(movies)) {
      console.error('Invalid movies data:', movies);
      return res.status(500).json({ message: 'Invalid data format from database' });
    }

    // Transform the data to include posterUrl
    const moviesWithUrls = movies.map(movie => {
      console.log('Processing movie:', movie.title);
      return {
        ...movie,
        posterUrl: movie.posterPath ? `/uploads/posters/${movie.posterPath}` : null
      };
    });

    console.log('Processed movies with URLs:', moviesWithUrls);
    console.log(`Found ${moviesWithUrls.length} movies`);
    
    res.json(moviesWithUrls);
  } catch (error) {
    console.error('Error in getMovies:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get a single movie
exports.getMovie = async (req, res) => {
  try {
    console.log('Fetching movie:', req.params.id);
    const movie = await Movie.findById(req.params.id)
      .select('title description duration genre releaseDate posterPath capacity screenType amenities showtimes createdAt')
      .lean();

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Transform the response to include posterUrl
    const movieWithUrl = {
      ...movie,
      posterUrl: `/uploads/posters/${movie.posterPath}`
    };

    console.log('Movie found:', movieWithUrl.title);
    res.json(movieWithUrl);
  } catch (error) {
    console.error('Error in getMovie:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get movies by genre
exports.getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    console.log('Fetching movies by genre:', genre);

    const movies = await Movie.find({ genre: { $regex: new RegExp(genre, 'i') } })
      .select('title description duration genre releaseDate posterPath capacity screenType amenities showtimes createdAt')
      .lean();

    // Transform the data to include posterUrl
    const moviesWithUrls = movies.map(movie => ({
      ...movie,
      posterUrl: `/uploads/posters/${movie.posterPath}`
    }));

    console.log(`Found ${moviesWithUrls.length} movies in genre ${genre}`);
    res.json(moviesWithUrls);
  } catch (error) {
    console.error('Error in getMoviesByGenre:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get upcoming movies
exports.getUpcomingMovies = async (req, res) => {
  try {
    const today = new Date();
    console.log('Fetching upcoming movies...');

    const movies = await Movie.find({ releaseDate: { $gte: today } })
      .select('title description duration genre releaseDate posterPath capacity screenType amenities showtimes createdAt')
      .sort({ releaseDate: 1 })
      .lean();

    // Transform the data to include posterUrl
    const moviesWithUrls = movies.map(movie => ({
      ...movie,
      posterUrl: `/uploads/posters/${movie.posterPath}`
    }));

    console.log(`Found ${moviesWithUrls.length} upcoming movies`);
    res.json(moviesWithUrls);
  } catch (error) {
    console.error('Error in getUpcomingMovies:', error);
    res.status(500).json({ message: error.message });
  }
};

// Search movies
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    console.log('Searching movies with query:', query);

    const movies = await Movie.find({
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { description: { $regex: new RegExp(query, 'i') } },
        { genre: { $regex: new RegExp(query, 'i') } }
      ]
    })
      .select('title description duration genre releaseDate posterPath capacity screenType amenities showtimes createdAt')
      .lean();

    // Transform the data to include posterUrl
    const moviesWithUrls = movies.map(movie => ({
      ...movie,
      posterUrl: `/uploads/posters/${movie.posterPath}`
    }));

    console.log(`Found ${moviesWithUrls.length} movies matching "${query}"`);
    res.json(moviesWithUrls);
  } catch (error) {
    console.error('Error in searchMovies:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get movie showtimes
exports.getMovieShowtimes = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching showtimes for movie:', id);

    const movie = await Movie.findById(id)
      .select('showtimes title capacity')
      .lean();

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Get bookings for this movie to check seat availability
    const bookings = await Booking.find({ movieId: id })
      .select('showtime seats')
      .lean();

    // Group bookings by showtime
    const showtimeBookings = bookings.reduce((acc, booking) => {
      if (!acc[booking.showtime]) {
        acc[booking.showtime] = [];
      }
      acc[booking.showtime].push(...booking.seats);
      return acc;
    }, {});

    // Format showtimes with availability
    const showtimes = movie.showtimes.map(showtime => ({
      time: showtime,
      bookedSeats: showtimeBookings[showtime] || [],
      availableSeats: movie.capacity - (showtimeBookings[showtime]?.length || 0)
    }));

    console.log(`Found ${showtimes.length} showtimes for ${movie.title}`);
    res.json({
      movieTitle: movie.title,
      showtimes
    });
  } catch (error) {
    console.error('Error in getMovieShowtimes:', error);
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
      amenities: req.body.amenities || [],
      showtimes: req.body.showtimes || []
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
    movie.showtimes = req.body.showtimes || movie.showtimes;

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



