const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is NOT set');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:');
    console.error('------------------------');
    console.error(error.message);
    
    if (!process.env.MONGODB_URI) {
      console.error('\nMONGODB_URI is not set in your .env file!');
      console.error('Please add your MongoDB Atlas connection string to server/.env:');
      console.error('MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/seatscene?retryWrites=true&w=majority');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection(); 