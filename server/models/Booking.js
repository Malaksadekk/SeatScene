const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  seats: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one seat is required']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  paymentDetails: {
    cardNumber: {
      type: String,
      required: true
    },
    cardHolder: {
      type: String,
      required: true
    },
    expiryDate: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
