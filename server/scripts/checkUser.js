const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`\nFound ${users.length} users in the database:`);

    for (const user of users) {
      console.log('\n----------------------------------------');
      console.log(`User: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Password Hash: ${user.password}`);
      
      // Test password comparison
      const testPassword = 'password123';
      const isMatch = await user.comparePassword(testPassword);
      console.log(`Password '${testPassword}' matches: ${isMatch}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkUser(); 