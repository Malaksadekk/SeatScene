const { verifyToken, extractToken } = require('../utils/jwtHelper');

// Authentication middleware
const authenticate = async function(req, res, next) {
  try {
    // Get token from header
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = await verifyToken(token);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// isAdmin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admins only' });
};

module.exports = { authenticate, isAdmin }; 