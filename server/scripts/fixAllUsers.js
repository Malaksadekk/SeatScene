const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const fixAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Fix Admin User
    const adminUser = await User.findOne({ email: 'admin@seatscene.com' });
    if (adminUser) {
      adminUser.password = 'admin123';
      await adminUser.save();
      console.log('\n1. Admin User Fixed:');
      console.log('   Email: admin@seatscene.com');
      console.log('   Password: admin123');
    }

    // 2. Fix Test User
    const testUser = await User.findOne({ email: 'test@seatscene.com' });
    if (testUser) {
      testUser.password = 'test123';
      await testUser.save();
      console.log('\n2. Test User Fixed:');
      console.log('   Email: test@seatscene.com');
      console.log('   Password: test123');
    }

    // 3. Fix all other users
    const users = await User.find({
      email: { 
        $nin: ['admin@seatscene.com', 'test@seatscene.com'],
        $not: /^test\./  // Exclude test users
      }
    });

    console.log(`\n3. Fixing ${users.length} other users`);

    for (const user of users) {
      user.password = 'password123';
      await user.save();
      console.log(`   Fixed user: ${user.email}`);
      console.log(`   New password: password123`);
    }

    console.log('\n=== Login Instructions ===');
    console.log('\n1. Admin Login:');
    console.log('   Email: admin@seatscene.com');
    console.log('   Password: admin123');

    console.log('\n2. Test User Login:');
    console.log('   Email: test@seatscene.com');
    console.log('   Password: test123');

    console.log('\n3. Other Users Login:');
    console.log('   Use their email');
    console.log('   Password: password123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixAllUsers(); 