const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { successResponse, errorResponse } = require("../utils/response");

exports.getOrCreateConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id; // Use _id to be safe

    // Find a conversation where these two are the ONLY participants
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    }).populate("participants", "fullName email profilePicture role");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
      // Populate after creation for the frontend
      await conversation.populate("participants", "fullName email profilePicture role");
    }

    return successResponse(res, conversation, 200, "Conversation retrieved");
  } catch (error) {
    console.error("getOrCreateConversation Error:", error);
    return errorResponse(res, "Failed to initialize conversation", 500);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return errorResponse(res, "Conversation not found", 404);

    // FIX: Proper ID comparison
    const isParticipant = conversation.participants.some(p => p.toString() === senderId.toString());
    if (!isParticipant) {
      return errorResponse(res, "Unauthorized to post in this chat", 403);
    }

    const newMessage = await Message.create({
      conversationId,
      sender: senderId,
      content,
    });

    // Update metadata
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date(),
    });

    return successResponse(res, newMessage, 201, "Message sent");
  } catch (error) {
    console.error("sendMessage Error:", error);
    return errorResponse(res, "Message delivery failed", 500);
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return errorResponse(res, "Conversation not found", 404);

    // FIX: Proper ID comparison
    const isParticipant = conversation.participants.some(p => p.toString() === userId.toString());
    if (!isParticipant) {
      return errorResponse(res, "Unauthorized", 403);
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "fullName profilePicture role")
      .sort({ createdAt: 1 });

    return successResponse(res, messages, 200, "Messages retrieved");
  } catch (error) {
    console.error("getMessages Error:", error);
    return errorResponse(res, "Could not fetch messages", 500);
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("participants", "fullName email profilePicture role")
      .sort({ lastMessageAt: -1 });

    return successResponse(res, conversations, 200, "Conversations retrieved");
  } catch (error) {
    console.error("getConversations Error:", error);
    return errorResponse(res, "Could not fetch conversation list", 500);
  }
};