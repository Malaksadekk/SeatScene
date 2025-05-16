const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Booking = require('../models/Booking');

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    console.log('Fetching stats...');
    const [users, movies, theaters, tickets] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Theater.countDocuments(),
      Booking.countDocuments()
    ]);
    console.log('Stats:', { users, movies, theaters, tickets });
    res.json({
      users,
      movies,
      theaters,
      tickets
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ message: error.message });
  }
};

// User management
exports.getUsers = async (req, res) => {
  try {
    console.log('Fetching users...');
    const users = await User.find().select('-password');
    console.log('Users found:', users);
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Movie management
exports.getMovies = async (req, res) => {
  try {
    console.log('Fetching movies...');
    const movies = await Movie.find();
    console.log('Movies found:', movies);
    res.json(movies);
  } catch (error) {
    console.error('Error in getMovies:', error);
    res.status(500).json({ message: error.message });
  }
};

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
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error in createMovie:', error);
    res.status(500).json({ message: error.message });
  }
};

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
    console.error('Error in updateMovie:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Theater management
exports.getTheaters = async (req, res) => {
  try {
    console.log('Fetching theaters...');
    const theaters = await Theater.find();
    console.log('Theaters found:', theaters);
    res.json(theaters);
  } catch (error) {
    console.error('Error in getTheaters:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.createTheater = async (req, res) => {
  try {
    const theater = new Theater(req.body);
    await theater.save();
    res.status(201).json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTheater = async (req, res) => {
  try {
    await Theater.findByIdAndDelete(req.params.id);
    res.json({ message: 'Theater deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ticket management
exports.getTickets = async (req, res) => {
  try {
    console.log('Fetching tickets...');
    const tickets = await Booking.find()
      .populate('userId', 'name email')
      .populate('movieId', 'title')
      .populate('theaterId', 'name');
    console.log('Tickets found:', tickets);
    res.json(tickets);
  } catch (error) {
    console.error('Error in getTickets:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
