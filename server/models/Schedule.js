const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    // Calculated using movie duration if not provided
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  bookedSeats: [{
    type: String, // Seat identifiers like "A1", "B5", etc.
    required: true
  }],
  // Optional: Additional schedule attributes
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'completed'],
    default: 'scheduled'
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

// Set endTime based on movie duration if not provided explicitly
scheduleSchema.pre('save', async function(next) {
  if (!this.endTime && this.isModified('startTime')) {
    try {
      const movie = await mongoose.model('Movie').findById(this.movie);
      if (movie && movie.duration) {
        // Calculate end time based on movie duration (in minutes)
        this.endTime = new Date(this.startTime.getTime() + movie.duration * 60000);
      }
    } catch (error) {
      console.error('Error calculating end time:', error);
    }
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

// Virtual for calculating available seats
scheduleSchema.virtual('availableSeats').get(function() {
  // This would require the actual theater capacity
  // For now, we'll return a placeholder
  return 100 - (this.bookedSeats ? this.bookedSeats.length : 0);
});

// Create index for efficient queries
scheduleSchema.index({ movie: 1, startTime: 1 });
scheduleSchema.index({ theater: 1, startTime: 1 });
scheduleSchema.index({ startTime: 1 }); // For date/time-based searches

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
