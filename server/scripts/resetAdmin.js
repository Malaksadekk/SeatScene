const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin
    await User.deleteOne({ email: 'admin@seatscene.com' });
    console.log('Deleted existing admin user');

    // Create new admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@seatscene.com',
      password: 'admin123', // Will be hashed by the pre-save hook
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('Role:', adminUser.role);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetAdmin(); 