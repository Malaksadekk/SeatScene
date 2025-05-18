const Schedule = require('../models/Schedule');
const Theater = require('../models/Theater');
const Movie = require('../models/Movie');

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('movie', 'title duration')
      .populate('theater', 'name location');
    
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Failed to fetch schedules' });
  }
};

// Get schedules by movie ID
exports.getSchedulesByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    // Validate if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const schedules = await Schedule.find({ movie: movieId })
      .populate('movie', 'title duration posterUrl')
      .populate('theater', 'name location');
    
    // Calculate and add available seats to each schedule
    const schedulesWithAvailability = schedules.map(schedule => {
      const totalSeats = schedule.theater.capacity || 100;
      const bookedSeats = schedule.bookedSeats ? schedule.bookedSeats.length : 0;
      const availableSeats = totalSeats - bookedSeats;
      
      return {
        ...schedule.toObject(),
        availableSeats
      };
    });
    
    res.status(200).json(schedulesWithAvailability);
  } catch (error) {
    console.error('Error fetching schedules for movie:', error);
    res.status(500).json({ message: 'Failed to fetch schedules for movie' });
  }
};

// Get schedules by theater ID
exports.getSchedulesByTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;
    
    // Validate if the theater exists
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    const schedules = await Schedule.find({ theater: theaterId })
      .populate('movie', 'title duration posterUrl')
      .populate('theater', 'name location');
    
    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules for theater:', error);
    res.status(500).json({ message: 'Failed to fetch schedules for theater' });
  }
};

// Get a specific schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    const schedule = await Schedule.findById(scheduleId)
      .populate('movie', 'title duration posterUrl')
      .populate('theater', 'name location capacity');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    // Calculate available seats
    const totalSeats = schedule.theater.capacity || 100;
    const bookedSeats = schedule.bookedSeats ? schedule.bookedSeats.length : 0;
    const availableSeats = totalSeats - bookedSeats;
    
    const scheduleWithAvailability = {
      ...schedule.toObject(),
      availableSeats
    };
    
    res.status(200).json(scheduleWithAvailability);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Failed to fetch schedule' });
  }
};

// Create a new schedule (admin only)
exports.createSchedule = async (req, res) => {
  try {
    const { movieId, theaterId, startTime, endTime, price } = req.body;
    
    // Validate required fields
    if (!movieId || !theaterId || !startTime || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate if movie and theater exist
    const movie = await Movie.findById(movieId);
    const theater = await Theater.findById(theaterId);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    // Create the schedule
    const newSchedule = new Schedule({
      movie: movieId,
      theater: theaterId,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined,
      price,
      bookedSeats: []
    });
    
    await newSchedule.save();
    
    // Populate the references
    await newSchedule.populate('movie', 'title duration');
    await newSchedule.populate('theater', 'name location');
    
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Failed to create schedule' });
  }
};

// Update a schedule (admin only)
exports.updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updates = req.body;
    
    // Convert date strings to Date objects if provided
    if (updates.startTime) {
      updates.startTime = new Date(updates.startTime);
    }
    
    if (updates.endTime) {
      updates.endTime = new Date(updates.endTime);
    }
    
    const schedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { $set: updates },
      { new: true, runValidators: true }
    )
    .populate('movie', 'title duration')
    .populate('theater', 'name location');
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.status(200).json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Failed to update schedule' });
  }
};

// Delete a schedule (admin only)
exports.deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    const schedule = await Schedule.findByIdAndDelete(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Failed to delete schedule' });
  }
};

// Book seats for a schedule
exports.bookSeats = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { seats } = req.body;
    
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Please provide valid seats to book' });
    }
    
    const schedule = await Schedule.findById(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    // Check if any of the requested seats are already booked
    const alreadyBooked = seats.filter(seat => 
      schedule.bookedSeats.includes(seat)
    );
    
    if (alreadyBooked.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked', 
        seats: alreadyBooked 
      });
    }
    
    // Update booked seats
    schedule.bookedSeats = [...schedule.bookedSeats, ...seats];
    await schedule.save();
    
    res.status(200).json({ 
      message: 'Seats booked successfully', 
      bookedSeats: schedule.bookedSeats 
    });
  } catch (error) {
    console.error('Error booking seats:', error);
    res.status(500).json({ message: 'Failed to book seats' });
  }
};
