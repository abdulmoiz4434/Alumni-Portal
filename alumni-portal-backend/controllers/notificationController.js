const ConnectionRequest = require('../models/ConnectionRequest');
const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Student = require('../models/Student');
const { successResponse, errorResponse } = require('../utils/response');

exports.sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return errorResponse(res, "Receiver ID is required", 400);
    }

    if (senderId.toString() === receiverId.toString()) {
      return errorResponse(res, "You cannot connect with yourself.", 400);
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return errorResponse(res, "User not found.", 404);
    }

    if (receiver.role === "admin") {
      return errorResponse(res, "Cannot send connection requests to admin users.", 403);
    }

    if (req.user.role === "admin") {
      return errorResponse(res, "Admin users cannot send connection requests.", 403);
    }

    const existing = await ConnectionRequest.findOne({ sender: senderId, receiver: receiverId });
    if (existing) {
      return errorResponse(res, "Request already pending or sent.", 400);
    }

    await ConnectionRequest.create({ sender: senderId, receiver: receiverId, status: 'pending' });
    return successResponse(res, null, 201, "Connection request sent!");
  } catch (err) {
    console.error("Send Connection Request Error:", err);
    return errorResponse(res, err.message, 500);
  }
};

exports.sendMentorshipRequest = async (req, res) => {
  try {
    const { alumnusId, message } = req.body;
    const studentId = req.user._id;

    if (!alumnusId) {
      return errorResponse(res, "Alumnus ID is required", 400);
    }

    const alumnus = await User.findById(alumnusId);
    if (!alumnus) {
      return errorResponse(res, "Alumnus not found.", 404);
    }

    if (alumnus.role === "admin") {
      return errorResponse(res, "Cannot send mentorship requests to admin users.", 403);
    }

    if (alumnus.role !== "alumni") {
      return errorResponse(res, "Mentorship requests can only be sent to alumni.", 400);
    }

    if (req.user.role !== "student") {
      return errorResponse(res, "Only students can send mentorship requests.", 403);
    }

    const existing = await MentorshipRequest.findOne({ student: studentId, alumnus: alumnusId });
    if (existing) {
      return errorResponse(res, "Application already submitted.", 400);
    }

    await MentorshipRequest.create({ student: studentId, alumnus: alumnusId, message, status: 'pending' });
    return successResponse(res, null, 201, "Mentorship application sent!");
  } catch (err) {
    console.error("Send Mentorship Request Error:", err);
    return errorResponse(res, err.message, 500);
  }
};

exports.getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({ receiver: userId, status: 'pending' })
      .populate('sender', 'fullName profilePicture role')
      .sort({ createdAt: -1 });

    return successResponse(res, requests, 200, "Connection requests fetched");
  } catch (err) {
    console.error("Get Connection Requests Error:", err);
    return errorResponse(res, "Fetch Error: " + err.message, 500);
  }
};

exports.getMentorshipRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const mentorshipRequests = await MentorshipRequest.find({ alumnus: userId, status: 'pending' })
      .populate('student', 'fullName profilePicture role')
      .sort({ createdAt: -1 });

    const enrichedRequests = await Promise.all(
      mentorshipRequests.map(async (request) => {
        const studentProfile = await Student.findOne({ user: request.student._id })
          .select('degree cgpa skills semester department batch');

        return {
          ...request.toObject(),
          studentProfile: studentProfile || null
        };
      })
    );

    return successResponse(res, enrichedRequests, 200, "Mentorship requests fetched");
  } catch (err) {
    console.error("Get Mentorship Requests Error:", err);
    return errorResponse(res, "Fetch Error: " + err.message, 500);
  }
};

exports.handleConnectionAction = async (req, res) => {
  try {
    const { id, action } = req.params;

    const request = await ConnectionRequest.findById(id);
    if (!request) {
      return errorResponse(res, "Request not found", 404);
    }

    if (action === 'reject') {
      await ConnectionRequest.findByIdAndDelete(id);
      return successResponse(res, null, 200, "Request declined.");
    }

    request.status = 'accepted';
    await request.save();

    await User.findByIdAndUpdate(request.sender, { $addToSet: { connections: request.receiver } });
    await User.findByIdAndUpdate(request.receiver, { $addToSet: { connections: request.sender } });

    const existingConv = await Conversation.findOne({
      participants: { $all: [request.sender, request.receiver] }
    });

    if (!existingConv) {
      await Conversation.create({
        participants: [request.sender, request.receiver],
        lastMessageAt: new Date()
      });
    }

    return successResponse(res, null, 200, "Request accepted successfully.");
  } catch (err) {
    console.error("Handle Connection Action Error:", err);
    return errorResponse(res, "Action Error: " + err.message, 500);
  }
};

exports.handleMentorshipAction = async (req, res) => {
  try {
    const { id, action } = req.params;

    const request = await MentorshipRequest.findById(id);
    if (!request) {
      return errorResponse(res, "Request not found", 404);
    }

    if (action === 'reject') {
      await MentorshipRequest.findByIdAndDelete(id);
      return successResponse(res, null, 200, "Request declined.");
    }

    request.status = 'accepted';
    await request.save();

    await User.findByIdAndUpdate(request.alumnus, { $addToSet: { mentees: request.student } });
    await User.findByIdAndUpdate(request.student, { $addToSet: { mentors: request.alumnus } });

    const existingConv = await Conversation.findOne({
      participants: { $all: [request.student, request.alumnus] }
    });

    if (!existingConv) {
      await Conversation.create({
        participants: [request.student, request.alumnus],
        lastMessageAt: new Date()
      });
    }

    return successResponse(res, null, 200, "Request accepted successfully.");
  } catch (err) {
    console.error("Handle Mentorship Action Error:", err);
    return errorResponse(res, "Action Error: " + err.message, 500);
  }
};

exports.getConnectionStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingRequests = await ConnectionRequest.find({
      sender: userId,
      status: 'pending'
    }).select('receiver');

    const currentUserData = await User.findById(userId).select('connections');
    const connections = currentUserData?.connections || [];

    return successResponse(res, {
      pending: pendingRequests.map(req => req.receiver.toString()),
      connected: connections.map(id => id.toString())
    }, 200, "Connection status fetched");
  } catch (err) {
    console.error("Get Connection Status Error:", err);
    return errorResponse(res, "Failed to fetch connection status", 500);
  }
};

exports.getMentorshipStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingApplications = await MentorshipRequest.find({
      student: userId,
      status: 'pending'
    }).select('alumnus');

    const currentUserData = await User.findById(userId).select('mentors');
    const mentors = currentUserData?.mentors || [];

    return successResponse(res, {
      pending: pendingApplications.map(req => req.alumnus.toString()),
      accepted: mentors.map(id => id.toString())
    }, 200, "Mentorship status fetched");
  } catch (err) {
    console.error("Get Mentorship Status Error:", err);
    return errorResponse(res, "Failed to fetch mentorship status", 500);
  }
};

exports.getNotificationCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const [connectionCount, mentorshipCount] = await Promise.all([
      ConnectionRequest.countDocuments({ receiver: userId, status: 'pending' }),
      MentorshipRequest.countDocuments({ alumnus: userId, status: 'pending' })
    ]);

    return successResponse(res, {
      connections: connectionCount,
      mentorship: mentorshipCount,
      total: connectionCount + mentorshipCount
    }, 200, "Notification count fetched");
  } catch (err) {
    console.error("Get Notification Count Error:", err);
    return errorResponse(res, "Failed to fetch notification count", 500);
  }
};