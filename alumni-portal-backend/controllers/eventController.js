const Event = require('../models/Event');
const { successResponse, errorResponse } = require('../utils/response');

// Get all events (with filtering based on user role)
exports.getAllEvents = async (req, res) => {
  try {
    const userRole = req.user.role;
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

    return successResponse(res, events, 200, "Events fetched successfully");
  } catch (error) {
    console.error("Get All Events Error:", error);
    return errorResponse(res, "Failed to load events", 500);
  }
};

// Get single event
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('registeredUsers', 'fullName email role');

    if (!event) {
      return errorResponse(res, 'Event not found', 404);
    }

    // Check role-based access
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      if (event.targetAudience === 'students' && userRole !== 'student') {
        return errorResponse(res, 'This event is only for students', 403);
      }
      if (event.targetAudience === 'alumni' && userRole !== 'alumni') {
        return errorResponse(res, 'This event is only for alumni', 403);
      }
    }

    return successResponse(res, event, 200, "Event fetched successfully");
  } catch (error) {
    console.error("Get Event By ID Error:", error);
    return errorResponse(res, "Failed to load event", 500);
  }
};

// Create event (Admin only)
exports.createEvent = async (req, res) => {
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
      createdBy: req.user._id || req.user.id
    };

    // Add Cloudinary image URL if uploaded
    if (req.file) {
      eventData.image = req.file.path;
    }

    const event = await Event.create(eventData);
    return successResponse(res, event, 201, "Event created successfully");
  } catch (error) {
    console.error("Create Event Error:", error);
    return errorResponse(res, error.message || "Failed to create event", 400);
  }
};

// Update event (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return errorResponse(res, 'Event not found', 404);
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

    // Update fields if provided
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

    // Update image if uploaded
    if (req.file) {
      event.image = req.file.path;
    }

    await event.save();

    return successResponse(res, event, 200, "Event updated successfully");
  } catch (error) {
    console.error("Update Event Error:", error);
    return errorResponse(res, "Failed to update event", 500);
  }
};

// Delete event (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return errorResponse(res, 'Event not found', 404);
    }

    return successResponse(res, null, 200, "Event deleted successfully");
  } catch (error) {
    console.error("Delete Event Error:", error);
    return errorResponse(res, "Failed to delete event", 500);
  }
};

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return errorResponse(res, 'Event not found', 404);
    }

    // Check if registration is open
    if (!event.isRegistrationOpen) {
      return errorResponse(res, 'Registration is closed for this event', 400);
    }

    // Check capacity
    if (event.capacity && event.registeredUsers.length >= event.capacity) {
      return errorResponse(res, 'Event is full', 400);
    }

    // Check if already registered
    if (event.registeredUsers.includes(req.user._id)) {
      return errorResponse(res, 'You are already registered for this event', 400);
    }

    // Check role-based access
    const userRole = req.user.role;
    if (event.targetAudience === 'students' && userRole !== 'student') {
      return errorResponse(res, 'This event is only for students', 403);
    }
    if (event.targetAudience === 'alumni' && userRole !== 'alumni') {
      return errorResponse(res, 'This event is only for alumni', 403);
    }

    // Register user
    event.registeredUsers.push(req.user._id);
    await event.save();

    return successResponse(res, null, 200, "Successfully registered for the event");
  } catch (error) {
    console.error("Register For Event Error:", error);
    return errorResponse(res, "Failed to register for event", 500);
  }
};

// Unregister from event
exports.unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return errorResponse(res, 'Event not found', 404);
    }

    // Check if user is registered
    const userIndex = event.registeredUsers.indexOf(req.user._id);
    if (userIndex === -1) {
      return errorResponse(res, 'You are not registered for this event', 400);
    }

    // Unregister user
    event.registeredUsers.splice(userIndex, 1);
    await event.save();

    return successResponse(res, null, 200, "Successfully unregistered from the event");
  } catch (error) {
    console.error("Unregister From Event Error:", error);
    return errorResponse(res, "Failed to unregister from event", 500);
  }
};