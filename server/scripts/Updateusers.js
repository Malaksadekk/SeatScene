const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise(res => readline.question(q, res));

const updateAnyUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const identifier = await ask('Enter user email or user ID: ');
    let user = await User.findOne({ email: identifier });
    if (!user) {
      user = await User.findById(identifier);
    }
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    const newEmail = await ask(`Enter new email (leave blank to keep "${user.email}"): `);
    if (newEmail) user.email = newEmail;

    const newPassword = await ask('Enter new password (leave blank to keep current): ');
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    console.log('User updated successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    readline.close();
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAnyUser();
