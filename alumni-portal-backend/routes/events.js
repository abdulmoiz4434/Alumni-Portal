// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all events (with filtering based on user role)
router.get('/events', protect, async (req, res) => {
  try {
    const userRole = req.user.role; // 'student', 'alumni', or 'admin'
    const { status, category, search } = req.query;

    let filter = {};

    // Role-based filtering
    if (userRole === 'student') {
      filter.targetAudience = { $in: ['all', 'students'] };
    } else if (userRole === 'alumni') {
      filter.targetAudience = { $in: ['all', 'alumni'] };
    }
    // Admin can see all events

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single event
router.get('/events/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('registeredUsers', 'fullName email role');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to this event
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      if (event.targetAudience === 'students' && userRole !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'This event is only for students'
        });
      }
      if (event.targetAudience === 'alumni' && userRole !== 'alumni') {
        return res.status(403).json({
          success: false,
          message: 'This event is only for alumni'
        });
      }
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create event (Admin only)
router.post('/events', protect, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      targetAudience,
      capacity,
      organizer,
      contactEmail,
      isRegistrationOpen
    } = req.body;

    const eventData = {
      title,
      description,
      category,
      date,
      time,
      venue,
      targetAudience,
      capacity: capacity || null,
      organizer,
      contactEmail,
      isRegistrationOpen: isRegistrationOpen !== undefined ? isRegistrationOpen : true,
      createdBy: req.user._id
    };

    if (req.file) {
      eventData.image = `/uploads/events/${req.file.filename}`;
    }

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update event (Admin only)
router.put('/events/:id', protect, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      targetAudience,
      capacity,
      organizer,
      contactEmail,
      status,
      isRegistrationOpen
    } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (date) event.date = date;
    if (time) event.time = time;
    if (venue) event.venue = venue;
    if (targetAudience) event.targetAudience = targetAudience;
    if (capacity !== undefined) event.capacity = capacity;
    if (organizer) event.organizer = organizer;
    if (contactEmail) event.contactEmail = contactEmail;
    if (status) event.status = status;
    if (isRegistrationOpen !== undefined) event.isRegistrationOpen = isRegistrationOpen;

    if (req.file) {
      event.image = `/uploads/events/${req.file.filename}`;
    }

    event.updatedAt = Date.now();
    await event.save();

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete event (Admin only)
router.delete('/events/:id', protect, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Register for event
router.post('/events/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if registration is open
    if (!event.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this event'
      });
    }

    // Check if event is full
    if (event.capacity && event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user already registered
    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check role-based access
    const userRole = req.user.role;
    if (event.targetAudience === 'students' && userRole !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'This event is only for students'
      });
    }
    if (event.targetAudience === 'alumni' && userRole !== 'alumni') {
      return res.status(403).json({
        success: false,
        message: 'This event is only for alumni'
      });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    res.json({
      success: true,
      message: 'Successfully registered for the event'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Unregister from event
router.post('/events/:id/unregister', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const userIndex = event.registeredUsers.indexOf(req.user._id);
    if (userIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    event.registeredUsers.splice(userIndex, 1);
    await event.save();

    res.json({
      success: true,
      message: 'Successfully unregistered from the event'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;