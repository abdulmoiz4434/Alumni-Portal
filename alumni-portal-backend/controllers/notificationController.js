const ConnectionRequest = require('../models/ConnectionRequest');
const MentorshipRequest = require('../models/MentorshipRequest');
const User = require('../models/User'); 

// 1. Send Connection Request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id || req.user.id;

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
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

// 2. Send Mentorship Request
exports.sendMentorshipRequest = async (req, res) => {
  try {
    const { alumnusId, message } = req.body;
    const studentId = req.user._id || req.user.id;

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
    console.log('=== GET REQUESTS DEBUG ===');
    console.log('User ID:', req.user._id || req.user.id);
    console.log('Original URL:', req.originalUrl);
    
    const userId = req.user._id || req.user.id;
    const isMentorshipRoute = req.originalUrl.toLowerCase().includes('mentorship');
    
    console.log('Is Mentorship Route?', isMentorshipRoute);
    
    let requests = [];

    if (!isMentorshipRoute) {
      // Directory Logic
      console.log('Fetching connection requests...');
      requests = await ConnectionRequest.find({ receiver: userId, status: 'pending' })
        .populate('sender', 'fullName profilePicture role')
        .sort({ createdAt: -1 });
      console.log('Connection requests found:', requests.length);
    } else {
      // Mentorship Logic
      console.log('Fetching mentorship requests...');
      const mentorshipRequests = await MentorshipRequest.find({ alumnus: userId, status: 'pending' })
        .populate('student', 'fullName profilePicture role')
        .sort({ createdAt: -1 });
      
      console.log('Mentorship requests found:', mentorshipRequests.length);
      if (mentorshipRequests.length > 0) {
        console.log('Sample request:', JSON.stringify(mentorshipRequests[0], null, 2));
      }
      
      requests = mentorshipRequests;
    }

    console.log('Returning requests count:', requests.length);
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    console.error("=== GET REQUESTS ERROR ===");
    console.error("Error:", err);
    console.error("Stack:", err.stack);
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

    // Accept Logic
    request.status = 'accepted';
    await request.save();

    if (!isMentorship) {
      // Connection Logic
      await User.findByIdAndUpdate(request.sender, { $addToSet: { connections: request.receiver } });
      await User.findByIdAndUpdate(request.receiver, { $addToSet: { connections: request.sender } });
    } else {
      // Mentorship Logic
      await User.findByIdAndUpdate(request.alumnus, { $addToSet: { mentees: request.student } });
      await User.findByIdAndUpdate(request.student, { $addToSet: { mentors: request.alumnus } });
    }

    res.status(200).json({ success: true, message: `Request accepted successfully.` });
  } catch (err) {
    console.error("HANDLE ACTION ERROR:", err);
    res.status(500).json({ success: false, message: "Action Error: " + err.message });
  }
};