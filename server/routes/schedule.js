const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/', scheduleController.getAllSchedules);
router.get('/movie/:movieId', scheduleController.getSchedulesByMovie);
router.get('/theater/:theaterId', scheduleController.getSchedulesByTheater);
router.get('/:scheduleId', scheduleController.getScheduleById);

// Protected routes - Require authentication
router.post(
  '/:scheduleId/book',
  authMiddleware.protect,
  scheduleController.bookSeats
);

// Admin routes - Require admin role
router.post(
  '/',
  authMiddleware.protect,
  roleMiddleware.restrictTo('admin'),
  scheduleController.createSchedule
);

router.put(
  '/:scheduleId',
  authMiddleware.protect,
  roleMiddleware.restrictTo('admin'),
  scheduleController.updateSchedule
);

router.delete(
  '/:scheduleId',
  authMiddleware.protect,
  roleMiddleware.restrictTo('admin'),
  scheduleController.deleteSchedule
);

module.exports = router;
