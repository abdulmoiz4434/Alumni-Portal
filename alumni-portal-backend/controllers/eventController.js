const Event = require('../models/Event');
const { successResponse, errorResponse } = require('../utils/response');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return successResponse(res, events, 200, "Events fetched successfully");
  } catch (error) {
    console.error("Get Events Error:", error);
    return errorResponse(res, "Failed to load events", 500);
  }
};

exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id 
    };

    const event = await Event.create(eventData);
    return successResponse(res, event, 201, "Event created successfully");
  } catch (error) {
    console.error("Create Event Error:", error);
    return errorResponse(res, error.message || "Failed to create event", 400);
  }
};