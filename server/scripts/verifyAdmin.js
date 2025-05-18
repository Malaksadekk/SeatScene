const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const verifyAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@seatscene.com' });
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }

    // Verify password
    const isMatch = await admin.comparePassword('admin123');
    console.log('Password verification result:', isMatch);
    
    // Log admin details (excluding password)
    console.log('Admin details:', {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    console.error('Error verifying admin password:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

verifyAdminPassword(); 