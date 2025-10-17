const express = require('express');
const router = express.Router();

// Example booking route (you can remove or modify as needed)
router.post('/', (req, res) => {
  res.json({ message: 'Booking endpoint is working.' });
});

module.exports = router;