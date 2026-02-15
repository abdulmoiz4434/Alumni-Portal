const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { uploadEventImage } = require('../middleware/upload');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent
} = require('../controllers/eventController');

// Get all events
router.get('/events', protect, getAllEvents);

// Get single event
router.get('/events/:id', protect, getEventById);

// Create event (Admin only)
router.post('/events', protect, isAdmin, uploadEventImage.single('image'), createEvent);

// Update event (Admin only)
router.put('/events/:id', protect, isAdmin, uploadEventImage.single('image'), updateEvent);

// Delete event (Admin only)
router.delete('/events/:id', protect, isAdmin, deleteEvent);

// Register for event
router.post('/events/:id/register', protect, registerForEvent);

// Unregister from event
router.post('/events/:id/unregister', protect, unregisterFromEvent);

module.exports = router;