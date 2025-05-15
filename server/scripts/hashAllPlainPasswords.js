const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const hashAllPlainPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // First, ensure admin user exists
    const adminEmail = 'admin@seatscene.com';
    const adminPassword = 'admin123';
    
    // Delete existing admin if exists
    await User.deleteOne({ email: adminEmail });
    
    // Create new admin user with consistent salt
    console.log('Creating admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const adminUser = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created successfully:', adminUser.email);
    console.log('Admin password hash:', hashedPassword);

    // Now hash all plain text passwords
    const users = await User.find({});
    let updated = 0;

    for (const user of users) {
      // If the password is not 60 chars (bcrypt hash length), hash it
      if (user.password.length !== 60) {
        const userSalt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, userSalt);
        await user.save();
        updated++;
        console.log(`Updated password for user: ${user.email}`);
      }
    }

    console.log(`Done. Updated ${updated} users.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

hashAllPlainPasswords();
