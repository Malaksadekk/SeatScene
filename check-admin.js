const mongoose = require('./server/node_modules/mongoose');
const dotenv = require('./server/node_modules/dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server/.env') });

async function checkAdminUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check for admin user
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String
    }));

    const adminUser = await User.findOne({ email: 'admin@seatscene.com' });
    
    if (adminUser) {
      console.log('Admin user found:');
      console.log('ID:', adminUser._id);
      console.log('Name:', adminUser.name);
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
    } else {
      console.log('Admin user not found in the database.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkAdminUser(); 