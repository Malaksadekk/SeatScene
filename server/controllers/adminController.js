const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Booking = require('../models/Booking');
const fs = require('fs').promises;
const path = require('path');

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
    if (!req.file) {
      return res.status(400).json({ message: 'Movie poster is required' });
    }

    const movie = new Movie({
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      posterPath: req.file.filename, // Store the filename
      capacity: req.body.capacity,
      screenType: req.body.screenType,
      amenities: JSON.parse(req.body.amenities || '[]'),
      showtimes: JSON.parse(req.body.showtimes || '[]')
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    // If there's an error, delete the uploaded file
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    console.error('Error in createMovie:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      // If there's a new file uploaded but movie not found, delete the file
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(404).json({ message: 'Movie not found' });
    }

    // If there's a new file uploaded, delete the old one
    if (req.file) {
      try {
        const oldFilePath = path.join(__dirname, '..', 'uploads', 'posters', movie.posterPath);
        await fs.unlink(oldFilePath);
      } catch (unlinkError) {
        console.error('Error deleting old file:', unlinkError);
      }
      movie.posterPath = req.file.filename;
    }

    // Update other fields
    movie.title = req.body.title || movie.title;
    movie.description = req.body.description || movie.description;
    movie.duration = req.body.duration || movie.duration;
    movie.genre = req.body.genre || movie.genre;
    movie.releaseDate = req.body.releaseDate || movie.releaseDate;
    movie.capacity = req.body.capacity || movie.capacity;
    movie.screenType = req.body.screenType || movie.screenType;
    movie.amenities = JSON.parse(req.body.amenities || JSON.stringify(movie.amenities));
    movie.showtimes = JSON.parse(req.body.showtimes || JSON.stringify(movie.showtimes));

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    // If there's an error and a new file was uploaded, delete it
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    console.error('Error in updateMovie:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Delete the poster file
    try {
      const filePath = path.join(__dirname, '..', 'uploads', 'posters', movie.posterPath);
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('Error deleting poster file:', unlinkError);
    }

    await movie.deleteOne();
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMovie:', error);
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
    const theater = new Theater({
      name: req.body.name,
      location: req.body.location,
      capacity: req.body.capacity,
      screenType: req.body.screenType,
      amenities: req.body.amenities || []
    });

    await theater.save();
    res.status(201).json(theater);
  } catch (error) {
    console.error('Error in createTheater:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        location: req.body.location,
        capacity: req.body.capacity,
        screenType: req.body.screenType,
        amenities: req.body.amenities,
        isActive: req.body.isActive
      },
      { new: true }
    );

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json(theater);
  } catch (error) {
    console.error('Error in updateTheater:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.json({ message: 'Theater deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTheater:', error);
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
