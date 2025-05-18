const mongoose = require('./server/node_modules/mongoose');
const bcrypt = require('./server/node_modules/bcryptjs');
const dotenv = require('./server/node_modules/dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server/.env') });

async function checkAdminPassword() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get admin user
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String
    }));

    const adminUser = await User.findOne({ email: 'admin@seatscene.com' });
    
    if (adminUser) {
      console.log('Admin user found');
      console.log('Password hash:', adminUser.password);
      
      // Test password
      const testPassword = 'admin123';
      console.log('Testing password:', testPassword);
      
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        // Create a new hash for comparison
        const newHash = await bcrypt.hash(testPassword, 10);
        console.log('Generated new hash:', newHash);
        
        // Update the password if needed
        if (confirm('Update admin password?')) {
          adminUser.password = newHash;
          await adminUser.save();
          console.log('Admin password updated');
        }
      }
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

// Helper function for confirmation
function confirm(message) {
  return process.argv.includes('--update');
}

checkAdminPassword(); 