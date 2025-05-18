const express = require('express');
const router = express.Router();
const SeatLayout = require('../models/SeatLayout');
const Booking = require('../models/Booking');
const { authenticate } = require('../middleware/auth');

// Book seats
router.post('/book', authenticate, async (req, res) => {
  try {
    const { movieId, theaterId, seats, totalAmount, showtime } = req.body;
    const userId = req.user._id;

    const seatLayout = await SeatLayout.findOne({ movieId, theaterId });
    if (!seatLayout) {
      return res.status(404).json({ error: 'Movie or theater not found' });
    }

    // Check if seats are available
    const unavailable = seats.some(seatId => 
      seatLayout.seating.unavailableSeats.includes(seatId)
    );
    
    if (unavailable) {
      return res.status(409).json({ error: 'Some seats are already taken' });
    }

    // Create the booking
    const booking = new Booking({
      userId,
      movieId,
      theaterId,
      seats,
      totalAmount,
      showtime,
      status: 'confirmed'
    });
    await booking.save();

    // Mark seats as unavailable
    seatLayout.seating.unavailableSeats.push(...seats);
    await seatLayout.save();

    res.json({ 
      success: true, 
      message: 'Seats booked successfully',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book seats' });
  }
});

// Get bookings for the logged-in user
router.get('/my', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('movieId')
      .populate('theaterId');
    res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel a booking
router.delete('/:bookingId', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if the booking belongs to the user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Make the seats available again
    const seatLayout = await SeatLayout.findOne({ 
      movieId: booking.movieId, 
      theaterId: booking.theaterId 
    });
    
    if (seatLayout) {
      seatLayout.seating.unavailableSeats = seatLayout.seating.unavailableSeats.filter(
        seatId => !booking.seats.includes(seatId)
      );
      await seatLayout.save();
    }

    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully' 
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
