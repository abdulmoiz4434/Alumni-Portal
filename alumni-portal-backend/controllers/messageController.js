const messageService = require("../services/messageService");
const { successResponse, errorResponse } = require("../utils/response");
const mongoose = require('mongoose');

const getOrCreateConversation = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return errorResponse(res, "Receiver ID is required", 400);
    }

    const conversation = await messageService.getOrCreateConversation(
      senderId,
      receiverId
    );

    const payload = {
      ...conversation.toObject(),
      id: conversation._id.toString()
    };

    return successResponse(res, payload, 200, "Conversation retrieved");
  } catch (error) {
    console.error("getOrCreateConversation Error:", error);
    return errorResponse(res, "Failed to initialize conversation", 500);
  }
};

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return errorResponse(res, "Missing conversationId or content", 400);
    }

    const conversation = await messageService.getConversationById(conversationId);
    if (!conversation) {
      return errorResponse(res, "Conversation not found", 404);
    }

    const userIdStr = req.user._id.toString();
    const isParticipant = conversation.participants.some(
      (p) => (p._id || p).toString() === userIdStr
    );

    if (!isParticipant) {
      return errorResponse(res, "Unauthorized access to conversation", 403);
    }

    const message = await messageService.createMessage(
      conversationId,
      senderId,
      content
    );

    const sender = await messageService.getUserById(message.senderId);
    const payload = {
      id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      sender_id: message.senderId.toString(),
      content: message.content,
      isRead: message.isRead,
      created_at: message.createdAt,
      sender
    };

    return successResponse(res, payload, 201, "Message sent");
  } catch (error) {
    console.error("sendMessage Error:", error);
    return errorResponse(res, "Message delivery failed", 500);
  }
};

const getMessagesController = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return errorResponse(res, "Invalid conversation ID", 400);
    }

    const messages = await messageService.getMessages(conversationId, userId);

    if (messages === null) {
      return errorResponse(res, "Conversation not found or access denied", 404);
    }

    const conversation = await messageService.getConversationById(conversationId);

    if (!conversation) {
      return errorResponse(res, "Conversation not found", 404);
    }

    return successResponse(
      res,
      { conversation, messages },
      200,
      "Messages retrieved"
    );
  } catch (error) {
    console.error("getMessages Error:", error);
    return errorResponse(res, "Could not fetch messages", 500);
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await messageService.getConversationsForUser(userId);
    return successResponse(res, conversations, 200, "Conversations retrieved");
  } catch (error) {
    console.error("getConversations Error:", error);
    return errorResponse(res, "Could not fetch conversation list", 500);
  }
};

module.exports = {
  getOrCreateConversation,
  sendMessage,
  getMessagesController,
  getConversations,
};