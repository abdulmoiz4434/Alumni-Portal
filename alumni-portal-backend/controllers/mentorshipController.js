const Mentorship = require("../models/Mentorship");

// @desc    Create a new mentorship
// @route   POST /api/mentorships
const createMentorship = async (req, res) => {
  try {
    const {
      title,
      field,
      duration,
      description,
      skills
    } = req.body;

    // Validation check
    if (!title || !field || !duration || !description || !skills) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Create mentorship
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
      message: error.message || "Server Error: Could not post mentorship"
    });
  }
};

// @desc    Get all mentorships
// @route   GET /api/mentorships
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
    console.error("Error fetching mentorships:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch mentorships"
    });
  }
};

// @desc    Get single mentorship
// @route   GET /api/mentorships/:id
const getMentorshipById = async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id)
      .populate("postedBy", "fullName email");

    if (!mentorship) {
      return res.status(404).json({
        success: false,
        message: "Mentorship not found"
      });
    }

    res.status(200).json({
      success: true,
      data: mentorship
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch mentorship"
    });
  }
};

// @desc    Update mentorship
// @route   PUT /api/mentorships/:id
const updateMentorship = async (req, res) => {
  try {
    let mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      return res.status(404).json({
        success: false,
        message: "Mentorship not found"
      });
    }

    // Check if user is the owner or admin
    if (mentorship.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only update your own mentorships"
      });
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
          ? (Array.isArray(skills)
              ? skills
              : skills.split(',').map(s => s.trim()))
          : mentorship.skills
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: mentorship,
      message: "Mentorship updated successfully"
    });
  } catch (error) {
    console.error("Error updating mentorship:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not update mentorship"
    });
  }
};

// @desc    Delete mentorship
// @route   DELETE /api/mentorships/:id
const deleteMentorship = async (req, res) => {
  try {
    const mentorship = await Mentorship.findById(req.params.id);

    if (!mentorship) {
      return res.status(404).json({
        success: false,
        message: "Mentorship not found"
      });
    }

    // Check if user is the owner or admin
    const isAdmin = req.user.role === "admin";
    const isOwner = mentorship.postedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only delete your own mentorships"
      });
    }

    await Mentorship.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Mentorship deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting mentorship:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete mentorship"
    });
  }
};

module.exports = {
  createMentorship,
  getAllMentorships,
  getMentorshipById,
  updateMentorship,
  deleteMentorship
};