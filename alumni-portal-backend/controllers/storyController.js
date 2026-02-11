const SuccessStory = require('../models/SuccessStories'); // Imported as SuccessStory

exports.getStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find() 
      .populate('alumnus', 'fullName profilePicture batch')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStory = async (req, res) => {
  try {
    const { title, content } = req.body;
    const story = await SuccessStory.create({
      alumnus: req.user.id, 
      title,
      content
    });

    const populatedStory = await SuccessStory.findById(story._id)
      .populate('alumnus', 'fullName profilePicture batch');

    res.status(201).json({ success: true, data: populatedStory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    // FIX: Check both .id and ._id for the logged-in user
    const currentUserId = req.user.id || req.user._id;

    // Check ownership or admin status
    const isOwner = story.alumnus.toString() === currentUserId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await story.deleteOne();
    res.status(200).json({ success: true, message: "Story removed" });
  } catch (error) {
    console.error("Delete Error:", error); // Check your terminal for this!
    res.status(500).json({ success: false, message: error.message });
  }
};