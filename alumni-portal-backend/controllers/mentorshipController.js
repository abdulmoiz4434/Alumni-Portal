const Mentorship = require("../models/Mentorship");
const MentorshipRequest = require("../models/MentorshipRequest");

// @desc    Send a mentorship application/request
// @route   POST /api/mentorship/apply
const sendMentorshipRequest = async (req, res) => {
  try {
    const { alumnusId, message } = req.body;
    const studentId = req.user._id;

    // 1. Prevent applying to yourself
    if (studentId.toString() === alumnusId.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: "You cannot apply to your own mentorship offering." 
      });
    }

    // 2. Check if an active request already exists 
    // UPDATED: Using 'student' and 'alumnus' to match your Model
    const existingRequest = await MentorshipRequest.findOne({
      student: studentId,
      alumnus: alumnusId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a pending application for this mentor." 
      });
    }

    // 3. Create the request
    // UPDATED: Using 'student' and 'alumnus' to match your Model
    await MentorshipRequest.create({
      student: studentId,
      alumnus: alumnusId,
      message,
      status: 'pending'
    });

    res.status(201).json({ 
      success: true, 
      message: "Application sent successfully!" 
    });
  } catch (error) {
    console.error("Mentorship Request Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error sending application: " + error.message 
    });
  }
};

// @desc    Create a new mentorship
const createMentorship = async (req, res) => {
  try {
    const { title, field, duration, description, skills } = req.body;

    if (!title || !field || !duration || !description || !skills) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    const mentorship = await Mentorship.create({
      postedBy: req.user._id,
      postedByName: req.user.fullName || req.user.name || "Alumni",
      postedByAvatar: req.user.profilePicture || null,
      title,
      field,
      duration,
      description,
      skills: Array.isArray(skills)
        ? skills
        : (skills ? skills.split(',').map(s => s.trim()) : []),
      status: "active"
    });

    res.status(201).json({
      success: true,
      data: mentorship,
      message: "Mentorship posted successfully"
    });
  } catch (error) {
    console.error("Error creating mentorship:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

// @desc    Get all mentorships
const getAllMentorships = async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ status: "active" })
      .populate("postedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mentorships.length,
      data: mentorships
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get single mentorship
const getMentorshipById = async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id)
      .populate("postedBy", "fullName email");

    if (!mentorship) {
      return res.status(404).json({ success: false, message: "Mentorship not found" });
    }

    res.status(200).json({ success: true, data: mentorship });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update mentorship
const updateMentorship = async (req, res) => {
  try {
    let mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      return res.status(404).json({ success: false, message: "Mentorship not found" });
    }

    if (mentorship.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { title, field, duration, description, skills } = req.body;

    mentorship = await Mentorship.findByIdAndUpdate(
      req.params.id,
      {
        title: title || mentorship.title,
        field: field || mentorship.field,
        duration: duration || mentorship.duration,
        description: description || mentorship.description,
        skills: skills
          ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()))
          : mentorship.skills
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: mentorship, message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete mentorship
const deleteMentorship = async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      return res.status(404).json({ success: false, message: "Mentorship not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = mentorship.postedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await Mentorship.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Mentorship deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createMentorship,
  getAllMentorships,
  getMentorshipById,
  updateMentorship,
  deleteMentorship,
  sendMentorshipRequest
};