const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkLatestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the most recent user
    const latestUser = await User.findOne().sort({ createdAt: -1 });
    if (!latestUser) {
      console.log('No users found in database');
      process.exit(1);
    }

    console.log('Latest user details:', {
      id: latestUser._id,
      name: latestUser.name,
      email: latestUser.email,
      role: latestUser.role,
      createdAt: latestUser.createdAt
    });

    // Verify password hash
    console.log('\nPassword hash exists:', !!latestUser.password);
    console.log('Password hash length:', latestUser.password.length);
  } catch (error) {
    console.error('Error checking latest user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkLatestUser(); 