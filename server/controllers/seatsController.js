const SeatLayout = require('../models/SeatLayout');

// Mocked seat layout for demonstration (replace with DB fetch in production)
const mockSeatLayout = [
  // Row A (VIP)
  ...Array.from({ length: 12 }, (_, i) => ({ row: 'A', number: i + 1, type: 'vip', available: true })),
  // Row B (VIP)
  ...Array.from({ length: 12 }, (_, i) => ({ row: 'B', number: i + 1, type: 'vip', available: true })),
  // Rows C-H (Regular)
  ...['C','D','E','F','G','H'].flatMap(row =>
    Array.from({ length: 12 }, (_, i) => ({ row, number: i + 1, type: 'regular', available: true }))
  )
];

const getSeatLayout = async (req, res) => {
  // In production, fetch from DB using movieId/showTime
  res.json({
    seats: mockSeatLayout,
    prices: { regular: 150, vip: 300 }
  });
};

module.exports = { getSeatLayout }; 