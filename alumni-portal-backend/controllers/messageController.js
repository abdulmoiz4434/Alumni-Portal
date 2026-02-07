const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { successResponse, errorResponse } = require("../utils/response");

exports.getOrCreateConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    console.log("=== START getOrCreateConversation ===");
    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);
    console.log("Receiver ID type:", typeof receiverId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    }).populate("participants", "fullName email profilePicture role");

    console.log("Found existing conversation:", conversation ? "YES" : "NO");

    if (!conversation) {
      console.log("Creating new conversation with participants:", [senderId, receiverId]);
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
      console.log("Created conversation:", conversation);
      console.log("Participants count:", conversation.participants.length);
      
      await conversation.populate("participants", "fullName email profilePicture role");
      console.log("After populate:", conversation);
    }

    console.log("Final conversation participants:", conversation.participants);
    console.log("=== END getOrCreateConversation ===");

    return successResponse(res, conversation, 200, "Conversation retrieved");
  } catch (error) {
    console.error("getOrCreateConversation Error:", error);
    return errorResponse(res, "Failed to initialize conversation", 500);
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, receiverId } = req.body;
    const senderId = req.user._id;

    if (!content || !conversationId) {
      return errorResponse(res, "Missing content or conversation ID", 400);
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return errorResponse(res, "Conversation not found", 404);
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === senderId.toString()
    );
    if (!isParticipant) {
      return errorResponse(res, "Unauthorized to post in this chat", 403);
    }

    const newMessage = await Message.create({
      conversationId,
      sender: senderId,
      content,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: content,
        sender: senderId
      },
      lastMessageAt: new Date(),
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "fullName profilePicture role"
    );

    return successResponse(res, populatedMessage, 201, "Message sent");
  } catch (error) {
    console.error("sendMessage Error Details:", error);
    return errorResponse(res, "Message delivery failed", 500);
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // FIXED: Only find existing conversations, don't create new ones
    let conversation;

    // Try to find by Conversation ID with populated participants
    if (conversationId.match(/^[0-9a-fA-F]{24}$/)) {
      conversation = await Conversation.findById(conversationId)
        .populate("participants", "fullName email profilePicture role department graduationYear batch");
    }

    // If not found, return error - don't create it here
    if (!conversation) {
      return errorResponse(res, "Conversation not found", 404);
    }

    // Verify user is a participant
    const isParticipant = conversation.participants.some(
      p => p._id.toString() === userId.toString()
    );
    
    if (!isParticipant) {
      return errorResponse(res, "Unauthorized", 403);
    }

    // Get all messages for this conversation
    const messages = await Message.find({ conversationId: conversation._id })
      .populate("sender", "fullName profilePicture role")
      .sort({ createdAt: 1 });

    return successResponse(res, {
      conversation,
      messages
    }, 200, "Messages retrieved");
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
    .populate({
      path: "participants",
      select: "fullName email profilePicture role department graduationYear batch"
    })
    .sort({ lastMessageAt: -1 })
    .exec();

    return successResponse(res, conversations, 200, "Conversations retrieved");
  } catch (error) {
    console.error("getConversations Error:", error);
    return errorResponse(res, "Could not fetch conversation list", 500);
  }
};