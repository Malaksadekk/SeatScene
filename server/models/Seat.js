const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  row: { type: String, required: true },
  number: { type: Number, required: true },
  type: { type: String, enum: ['regular', 'vip'], required: true },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Seat', seatSchema); 