const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id
    }
  };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
};

// Extract token from request header
const extractToken = (req) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  return token;
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken
};




