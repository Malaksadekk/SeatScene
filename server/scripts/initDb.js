const mongoose = require('mongoose');
const Movie = require('../models/SeatLayout');
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
    console.log('Existing data cleared');

    const movies = [
      {
        movieId: "68273ef28f1803cc8b2aac55",
        title: "Thunderbolts",
        seating: {
          vipPrice: 300,
          regularPrice: 150,
          vipRows: ["A", "B"],
          rows: 8,
          seatsPerRow: 12,
          unavailableseats: ["A1", "A2", "B3", "C4", "D5", "E6", "F7", "G8"]
        }
      },
      {
        movieId: "682752a53461011dc48662a8",
        title: "Until Dawn",
        seating: {
          vipPrice: 300,
          regularPrice: 150,
          vipRows: ["A", "B"],
          rows: 8,
          seatsPerRow: 12,
          unavailableseats: []
        }
      },
      {
        movieId: "682754973461011dc48662b0",
        title: "The Accountant 2",
        seating: {
          vipPrice: 300,
          regularPrice: 150,
          vipRows: ["A", "B"],
          rows: 8,
          seatsPerRow: 12,
          unavailableseats: []
        }
      },
      {
        movieId: "682755633461011dc48662ba",
        title: "Al-Hana Elli Ana Fih",
        seating: {
          vipPrice: 300,
          regularPrice: 150,
          vipRows: ["A", "B"],
          rows: 8,
          seatsPerRow: 12,
          unavailableseats: []
        }
      },
      {
        movieId: "6827535d3461011dc48662ac",
        title: "Flight 404",
        seating: {
          vipPrice: 300,
          regularPrice: 150,
          vipRows: ["A", "B"],
          rows: 8,
          seatsPerRow: 12,
          unavailableseats: []
        }
      },
      {
        movieId: "68273ef28f1803cc8b2aac57",
        title: "Siko Siko",
        seating: {
          vipPrice: 300,
          regularPrice: 150,
          vipRows: ["A", "B"],
          rows: 8,
          seatsPerRow: 12,
          unavailableseats: []
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