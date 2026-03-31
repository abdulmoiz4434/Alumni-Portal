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

router.get('/events', protect, getAllEvents);

router.get('/events/:id', protect, getEventById);

router.post('/events', protect, isAdmin, uploadEventImage.single('image'), createEvent);

router.put('/events/:id', protect, isAdmin, uploadEventImage.single('image'), updateEvent);

router.delete('/events/:id', protect, isAdmin, deleteEvent);

router.post('/events/:id/register', protect, registerForEvent);

router.post('/events/:id/unregister', protect, unregisterFromEvent);

module.exports = router;