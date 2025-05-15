const { verifyToken, extractToken } = require('../utils/jwtHelper');

module.exports = async function(req, res, next) {
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