const mongoose = require('mongoose');

const seatLayoutSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  title: { type: String, required: true },
  seating: {
    vipPrice: { type: Number, required: true },
    regularPrice: { type: Number, required: true },
    vipRows: [{ type: String, required: true }],
    rows: { type: Number, required: true },
    seatsPerRow: { type: Number, required: true },
    unavailableSeats: [{ type: String, required: true }]
  }
});

module.exports = mongoose.model('SeatLayout', seatLayoutSchema, 'seatlayouts');