const axios = require('./server/node_modules/axios').default;

// Admin credentials as found in the database
const credentials = {
  email: 'admin@seatscene.com',
  password: 'admin123'
};

// Test direct login to server
async function testLogin() {
  try {
    console.log('Testing login with:', credentials);
    
    // Make direct request to server
    const response = await axios.post('http://localhost:5001/api/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Status:', response.status);
    console.log('Response data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Display token and user info
    console.log('\nToken:', response.data.token);
    console.log('User ID:', response.data.user.id);
    console.log('Name:', response.data.user.name);
    console.log('Email:', response.data.user.email);
    console.log('Role:', response.data.user.role);
    
    // Test protected route
    if (response.data.token) {
      console.log('\nTesting access to protected route with token...');
      const profileResponse = await axios.get('http://localhost:5001/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${response.data.token}`
        }
      });
      
      console.log('Profile access successful!');
      console.log('Profile data:');
      console.log(JSON.stringify(profileResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('Login failed!');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testLogin(); 