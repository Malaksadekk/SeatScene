const mongoose = require('mongoose');
require('dotenv').config();

async function checkMongoConnection() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // Try to connect with a short timeout
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Successfully connected to MongoDB Atlas');
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.error('\n❌ MongoDB Atlas Connection Error:');
    console.error('------------------------');
    console.error('Could not connect to MongoDB Atlas.');
    console.error('\nTo fix this:');
    console.error('1. Check your .env file has the correct MONGODB_URI:');
    console.error('   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/seatscene?retryWrites=true&w=majority');
    console.error('\n2. Make sure to:');
    console.error('   - Replace <username> with your Atlas username');
    console.error('   - Replace <password> with your Atlas password');
    console.error('   - Replace <cluster> with your cluster address');
    console.error('\n3. Verify your IP address is whitelisted in Atlas:');
    console.error('   - Go to Network Access in Atlas');
    console.error('   - Add your current IP address');
    console.error('\n4. Check your Atlas cluster is running');
    console.error('\nAfter fixing, run: npm run init-db');
    return false;
  }
}

// Run the check
checkMongoConnection(); 