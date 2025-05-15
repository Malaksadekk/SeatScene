const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateUserEmail = async () => {
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

    // Update email to valid format
    user.email = 'nermeen@example.com';
    await user.save();

    console.log('User email updated successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error updating user email:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateUserEmail(); 