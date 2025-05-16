const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  row: { type: String, required: true },
  number: { type: Number, required: true },
  type: { type: String, enum: ['regular', 'vip'], required: true },
  available: { type: Boolean, default: true }
});

const seatingSchema = new mongoose.Schema({
  vipPrice: { type: Number, required: true },
  regularPrice: { type: Number, required: true },
  vipRows: [{ type: String, required: true }], // Array of VIP row letters
  rows: { type: Number, required: true }, // Total number of rows
  seatsPerRow: { type: Number, required: true }, // Seats per row
  unavailableSeats: [{ type: String, required: false }], // Array of seat identifiers (e.g., "A9")
  seats: [seatSchema] // Optional: pre-populated seats based on configuration
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  seating: { type: seatingSchema, required: true }
});

module.exports = mongoose.model('Movie', movieSchema);
