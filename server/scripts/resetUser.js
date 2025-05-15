const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by current email
    const user = await User.findOne({ email: 'nermeen@2033' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Update email and password
    user.email = 'nermeen.radwan@example.com';
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash('password123', salt);
    await user.save();

    console.log('User updated successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    console.log('\nNew login credentials:');
    console.log('Email:', user.email);
    console.log('Password: password123');
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetUser(); 