const SuccessStory = require('../models/SuccessStories');
const { successResponse, errorResponse } = require('../utils/response');

exports.getStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find()
      .populate('alumnus', 'fullName profilePicture batch')
      .sort({ createdAt: -1 });

    return successResponse(res, stories, 200, "Stories fetched successfully");
  } catch (error) {
    console.error("Get Stories Error:", error);
    return errorResponse(res, error.message, 500);
  }
};

exports.createStory = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return errorResponse(res, "Title and content are required", 400);
    }

    const story = await SuccessStory.create({
      alumnus: req.user.id,
      title,
      content
    });

    const populatedStory = await SuccessStory.findById(story._id)
      .populate('alumnus', 'fullName profilePicture batch');

    return successResponse(res, populatedStory, 201, "Story created successfully");
  } catch (error) {
    console.error("Create Story Error:", error);
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return errorResponse(res, "Story not found", 404);
    }

    const currentUserId = req.user.id || req.user._id;
    const isOwner = story.alumnus.toString() === currentUserId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return errorResponse(res, "Not authorized", 403);
    }

    await story.deleteOne();
    return successResponse(res, null, 200, "Story removed");
  } catch (error) {
    console.error("Delete Story Error:", error);
    return errorResponse(res, error.message, 500);
  }
};