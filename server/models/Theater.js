const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  screenType: {
    type: String,
    required: true,
    enum: ['2D', '3D', 'IMAX', '4DX']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
theaterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater; 