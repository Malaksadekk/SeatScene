const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const listUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log('All users in database:');
    users.forEach(user => {
      console.log({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    });

    // Count total users
    console.log('\nTotal users:', users.length);
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

listUsers(); 