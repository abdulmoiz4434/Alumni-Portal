const Mentorship = require("../models/Mentorship");
const MentorshipRequest = require("../models/MentorshipRequest");
const { successResponse, errorResponse } = require("../utils/response");

// @desc    Send a mentorship application/request
// @route   POST /api/mentorship/apply
const sendMentorshipRequest = async (req, res) => {
  try {
    const { alumnusId, message } = req.body;
    const studentId = req.user._id;

    if (!alumnusId) {
      return errorResponse(res, "Alumnus ID is required", 400);
    }

    // Prevent applying to yourself
    if (studentId.toString() === alumnusId.toString()) {
      return errorResponse(res, "You cannot apply to your own mentorship offering.", 400);
    }

    // Check if an active request already exists
    const existingRequest = await MentorshipRequest.findOne({
      student: studentId,
      alumnus: alumnusId,
      status: 'pending'
    });

    if (existingRequest) {
      return errorResponse(res, "You already have a pending application for this mentor.", 400);
    }

    await MentorshipRequest.create({
      student: studentId,
      alumnus: alumnusId,
      message,
      status: 'pending'
    });

    return successResponse(res, null, 201, "Application sent successfully!");
  } catch (error) {
    console.error("Mentorship Request Error:", error);
    return errorResponse(res, "Server error sending application: " + error.message, 500);
  }
};

// @desc    Create a new mentorship
const createMentorship = async (req, res) => {
  try {
    const { title, field, duration, description, skills } = req.body;

    if (!title || !field || !duration || !description || !skills) {
      return errorResponse(res, "Please fill all required fields", 400);
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

    return successResponse(res, mentorship, 201, "Mentorship posted successfully");
  } catch (error) {
    console.error("Error creating mentorship:", error);
    return errorResponse(res, error.message || "Server Error", 500);
  }
};

// @desc    Get all mentorships
const getAllMentorships = async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ status: "active" })
      .populate("postedBy", "fullName email")
      .sort({ createdAt: -1 });

    return successResponse(res, mentorships, 200, "Mentorships fetched successfully");
  } catch (error) {
    console.error("Error fetching mentorships:", error);
    return errorResponse(res, "Server Error", 500);
  }
};

// @desc    Get single mentorship
const getMentorshipById = async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id)
      .populate("postedBy", "fullName email");

    if (!mentorship) {
      return errorResponse(res, "Mentorship not found", 404);
    }

    return successResponse(res, mentorship, 200);
  } catch (error) {
    console.error("Error fetching mentorship by ID:", error);
    return errorResponse(res, "Server Error", 500);
  }
};

// @desc    Update mentorship
const updateMentorship = async (req, res) => {
  try {
    let mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      return errorResponse(res, "Mentorship not found", 404);
    }

    if (mentorship.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return errorResponse(res, "Access denied", 403);
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

    return successResponse(res, mentorship, 200, "Updated successfully");
  } catch (error) {
    console.error("Error updating mentorship:", error);
    return errorResponse(res, "Server Error", 500);
  }
};

// @desc    Delete mentorship
const deleteMentorship = async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      return errorResponse(res, "Mentorship not found", 404);
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = mentorship.postedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return errorResponse(res, "Access denied", 403);
    }

    await Mentorship.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 200, "Mentorship deleted successfully");
  } catch (error) {
    console.error("Error deleting mentorship:", error);
    return errorResponse(res, "Server Error", 500);
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