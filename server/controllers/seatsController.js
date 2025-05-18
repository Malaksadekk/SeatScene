const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const SeatLayout = require('../models/SeatLayout');

// Get seat layout for a movie
const getSeatLayout = async (req, res) => {
  try {
    const { movieId } = req.query;
    // Debug log for received movieId and its type
    console.log('getSeatLayout: received movieId:', movieId, 'type:', typeof movieId);
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    // Convert movieId to ObjectId
    let objectId;
    try {
      objectId = mongoose.Types.ObjectId(movieId);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    console.log('Received movieId:', movieId);

    // Find the seat layout by movieId
    const seatLayout = await SeatLayout.findOne({ movieId: objectId });
    if (!seatLayout) {
      return res.status(404).json({ message: 'Seat layout not found' });
    }

    const { seating } = seatLayout;
    const rows = 'ABCDEFGH'.split('').slice(0, seating.rows);
    const seats = [];

    for (const row of rows) {
      for (let i = 1; i <= seating.seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        seats.push({
          row,
          number: i,
          type: seating.vipRows.includes(row) ? 'vip' : 'regular',
          available: !seating.unavailableSeats.includes(seatId)
        });
      }
    }

    res.json({
      seats,
      prices: {
        regular: seating.regularPrice,
        vip: seating.vipPrice
      }
    });
  } catch (error) {
    console.error('Error fetching seat layout:', error);
    res.status(500).json({ message: 'Failed to fetch seat layout' });
  }
};

// Update seat availability for a movie
const updateSeatAvailability = async (req, res) => {
  try {
    const { movieId, seats } = req.body;

    if (!movieId || !seats || !Array.isArray(seats)) {
      return res.status(400).json({
        message: 'Invalid request parameters',
        error: 'INVALID_PARAMETERS'
      });
    }

    // Convert movieId to ObjectId
    let objectId;
    try {
      objectId = mongoose.Types.ObjectId(movieId);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    // Find the seat layout
    const seatLayout = await SeatLayout.findOne({ movieId: objectId });
    if (!seatLayout) {
      return res.status(404).json({ message: 'Seat layout not found' });
    }

    // Update unavailable seats
    const updatedUnavailableSeats = [...new Set([...seatLayout.seating.unavailableSeats, ...seats])];
    
    // Update the seat layout
    await SeatLayout.findOneAndUpdate(
      { movieId: objectId },
      { 'seating.unavailableSeats': updatedUnavailableSeats },
      { new: true }
    );

    res.json({
      message: 'Seats updated successfully',
      seats
    });
  } catch (error) {
    console.error('Error updating seats:', error);
    res.status(500).json({
      message: 'Failed to update seats',
      error: 'SERVER_ERROR'
    });
  }
};

module.exports = {
  getSeatLayout,
  updateSeatAvailability
}; 