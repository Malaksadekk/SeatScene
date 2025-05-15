const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const setupUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Create Admin User
    await User.deleteOne({ email: 'admin@seatscene.com' });
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@seatscene.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('\n👤 Admin User Created:');
    console.log('   Email: admin@seatscene.com');
    console.log('   Password: admin123');

    // 2. Create Test Users for all real users (exclude admin & already test users)
    const users = await User.find({
      email: {
        $ne: 'admin@seatscene.com',
        $not: /^test\./
      }
    });

    console.log(`\n🧪 Creating Test Users for ${users.length} existing users`);

    for (const user of users) {
      const testEmail = `test.${user.email}`;
      const testPassword = 'test123';

      // Prevent duplication
      await User.deleteOne({ email: testEmail });

      const testUser = new User({
        name: `Test ${user.name}`,
        email: testEmail,
        password: testPassword,
        role: 'user'
      });

      await testUser.save();

      console.log(`   ✅ Test user created for ${user.email}`);
      console.log(`   -> Email: ${testEmail}`);
      console.log(`   -> Password: ${testPassword}`);
    }

    // 3. Output Summary
    console.log('\n=== Login Instructions ===');

    console.log('\n🔐 Admin Login:');
    console.log('   Email: admin@seatscene.com');
    console.log('   Password: admin123');
    console.log('   Redirects to: Admin Dashboard');

    console.log('\n👥 Test Users Login:');
    console.log('   For each original user, a test user was created:');
    console.log('   Example:');
    console.log('   - Original: user@example.com');
    console.log('   - Test: test.user@example.com');
    console.log('   - Password: test123');
    console.log('   Redirects to: Profile Page');

    console.log('\n📝 New User Registration:');
    console.log('   - Go to registration page');
    console.log('   - Fill in name, email, and password');
    console.log('   - You can login right away');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setupUsers();
