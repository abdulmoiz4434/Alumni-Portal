const ConnectionRequest = require('../models/ConnectionRequest');
const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Student = require('../models/Student');

// 1. Send Connection Request - UPDATED WITH RBAC
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id || req.user.id;

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found." });
    }

    if (receiver.role === "admin") {
      return res.status(403).json({ message: "Cannot send connection requests to admin users." });
    }

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin users cannot send connection requests." });
    }

    const existing = await ConnectionRequest.findOne({ sender: senderId, receiver: receiverId });
    if (existing) return res.status(400).json({ message: "Request already pending or sent." });

    const newRequest = new ConnectionRequest({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json({ success: true, message: "Connection request sent!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Send Mentorship Request - UPDATED WITH RBAC
exports.sendMentorshipRequest = async (req, res) => {
  try {
    const { alumnusId, message } = req.body;
    const studentId = req.user._id || req.user.id;

    const alumnus = await User.findById(alumnusId);
    if (!alumnus) {
      return res.status(404).json({ message: "Alumnus not found." });
    }

    if (alumnus.role === "admin") {
      return res.status(403).json({ message: "Cannot send mentorship requests to admin users." });
    }

    if (alumnus.role !== "alumni") {
      return res.status(400).json({ message: "Mentorship requests can only be sent to alumni." });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can send mentorship requests." });
    }

    const existing = await MentorshipRequest.findOne({ student: studentId, alumnus: alumnusId });
    if (existing) return res.status(400).json({ message: "Application already submitted." });

    const newRequest = new MentorshipRequest({
      student: studentId,
      alumnus: alumnusId,
      message,
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json({ success: true, message: "Mentorship application sent!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Get all requests
exports.getRequests = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const isMentorshipRoute = req.originalUrl.toLowerCase().includes('mentorship');
    
    let requests = [];

    if (!isMentorshipRoute) {
      requests = await ConnectionRequest.find({ receiver: userId, status: 'pending' })
        .populate('sender', 'fullName profilePicture role')
        .sort({ createdAt: -1 });
    } else {
      const mentorshipRequests = await MentorshipRequest.find({ alumnus: userId, status: 'pending' })
        .populate('student', 'fullName profilePicture role')
        .sort({ createdAt: -1 });
      
      const enrichedRequests = await Promise.all(
        mentorshipRequests.map(async (req) => {
          const studentProfile = await Student.findOne({ user: req.student._id })
            .select('degree cgpa skills semester department batch');
          
          return {
            ...req.toObject(),
            studentProfile: studentProfile || null
          };
        })
      );
      
      requests = enrichedRequests;
    }

    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error("GET REQUESTS ERROR:", err);
    res.status(500).json({ success: false, message: "Fetch Error: " + err.message });
  }
};

// 4. Handle Action (Accept/Reject)
exports.handleAction = async (req, res) => {
  try {
    const { id, action } = req.params;
    const isMentorship = req.originalUrl.toLowerCase().includes('mentorship');
    const Model = isMentorship ? MentorshipRequest : ConnectionRequest;

    const request = await Model.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (action === 'reject') {
      await Model.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Request declined." });
    } 

    request.status = 'accepted';
    await request.save();

    if (!isMentorship) {
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
    } else {
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
    }

    res.status(200).json({ success: true, message: `Request accepted successfully.` });
  } catch (err) {
    console.error("HANDLE ACTION ERROR:", err);
    res.status(500).json({ success: false, message: "Action Error: " + err.message });
  }
};

// 5. Get Connection Status
exports.getConnectionStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const pendingRequests = await ConnectionRequest.find({ 
      sender: userId, 
      status: 'pending' 
    }).select('receiver');

    const currentUserData = await User.findById(userId).select('connections');
    const connections = currentUserData?.connections || [];

    res.status(200).json({ 
      success: true, 
      data: {
        pending: pendingRequests.map(req => req.receiver.toString()),
        connected: connections.map(id => id.toString())
      }
    });
  } catch (err) {
    console.error("GET CONNECTION STATUS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch connection status" });
  }
};

// 6. Get Mentorship Status
exports.getMentorshipStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const pendingApplications = await MentorshipRequest.find({ 
      student: userId, 
      status: 'pending' 
    }).select('alumnus');

    const currentUserData = await User.findById(userId).select('mentors');
    const mentors = currentUserData?.mentors || [];

    res.status(200).json({ 
      success: true, 
      data: {
        pending: pendingApplications.map(req => req.alumnus.toString()),
        accepted: mentors.map(id => id.toString())
      }
    });
  } catch (err) {
    console.error("GET MENTORSHIP STATUS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch mentorship status" });
  }
};

// 7. Get Notification Count
exports.getNotificationCount = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // Count pending connection requests
    const connectionCount = await ConnectionRequest.countDocuments({ 
      receiver: userId, 
      status: 'pending' 
    });

    // Count pending mentorship requests
    const mentorshipCount = await MentorshipRequest.countDocuments({ 
      alumnus: userId, 
      status: 'pending' 
    });

    const total = connectionCount + mentorshipCount;

    res.status(200).json({ 
      success: true, 
      data: {
        connections: connectionCount,
        mentorship: mentorshipCount,
        total: total
      }
    });
  } catch (err) {
    console.error("GET NOTIFICATION COUNT ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notification count" });
  }
};