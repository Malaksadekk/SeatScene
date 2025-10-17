const getProfile = async (req, res) => {
  try {
    const user = req.user;
    console.log('User from middleware:', user); // Debug log
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Profile error details:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
};