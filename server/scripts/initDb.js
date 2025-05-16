const mongoose = require('mongoose');
const Movie = require('../models/SeatLayout');
const Seat = require('../models/Seat');
require('dotenv').config();

async function initializeDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    console.log('Clearing existing data...');
    await Movie.deleteMany({});
    await Seat.deleteMany({});
    console.log('Existing data cleared');

    // Create sample seats
    console.log('Creating seats...');
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    for (const row of rows) {
      for (let number = 1; number <= 12; number++) {
        const type = ['A', 'B'].includes(row) ? 'vip' : 'regular';
        const seat = await Seat.create({
          row,
          number,
          type,
          available: true
        });
        seats.push(seat._id);
      }
    }
    console.log(`${seats.length} seats created`);

    // Create sample movies
    console.log('Creating sample movies...');
    const movies = [
      {
        title: 'The Matrix',
        seating: {
          vipPrice: 250,
          regularPrice: 150,
          vipRows: ['A', 'B'],
          rows: 8,
          seatsPerRow: 12,
          unavailableSeats: ['A3', 'A4', 'B5', 'C2'],
          seats: seats
        }
      },
      {
        title: 'Inception',
        seating: {
          vipPrice: 250,
          regularPrice: 150,
          vipRows: ['A', 'B'],
          rows: 8,
          seatsPerRow: 12,
          unavailableSeats: ['A1', 'B2', 'C3'],
          seats: seats
        }
      }
    ];

    await Movie.insertMany(movies);
    console.log(`${movies.length} movies created`);

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

initializeDatabase(); 