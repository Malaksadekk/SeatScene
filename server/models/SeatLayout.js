const mongoose = require('mongoose');
const Seat = require('./Seat');

const seatingSchema = new mongoose.Schema({
  vipPrice: { type: Number, required: true },
  regularPrice: { type: Number, required: true },
  vipRows: [{ type: String, required: true }], // Array of VIP row letters
  rows: { type: Number, required: true }, // Total number of rows
  seatsPerRow: { type: Number, required: true }, // Seats per row
  unavailableSeats: [{ type: String, required: false }], // Array of seat identifiers (e.g., "A9")
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }] // Reference to Seat model
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  seating: { type: seatingSchema, required: true }
});

// Check if model exists before creating
module.exports = mongoose.models.Movie || mongoose.model('Movie', movieSchema);