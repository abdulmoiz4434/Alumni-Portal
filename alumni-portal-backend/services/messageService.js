const mongoose = require("mongoose");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

/**
 * Get user details by ID (for enrichment).
 */
async function getUserById(userId) {
  const user = await User.findById(userId).select("fullName email role profilePicture department");
  return user || { _id: userId, fullName: "Unknown User" };
}

/**
 * Create a message and update conversation last message.
 */
async function createMessage(conversationId, senderId, content) {
  const message = await Message.create({
    conversationId,
    senderId,
    content: content.trim(),
    isRead: false
  });
  await Conversation.updateLastMessage(conversationId, message);
  return message;
}

/**
 * Get messages for a conversation. Verifies user is a participant.
 */
async function getMessages(conversationId, userId) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) return null;
  const userIdStr = userId.toString();
  const isParticipant = conversation.participants.some(
    (p) => p.toString() === userIdStr
  );
  if (!isParticipant) return null;

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();

  // FIX: Handle cases where messages array might be empty or have undefined fields
  if (!messages || messages.length === 0) {
    return []; // Return empty array for new conversations with no messages
  }

  const enriched = await Promise.all(
    messages.map(async (msg) => {
      // FIX: Add safety checks for undefined fields
      const senderId = msg.senderId || msg.sender?._id || msg.sender;
      const sender = senderId ? await getUserById(senderId) : { _id: 'unknown', fullName: 'Unknown User' };

      return {
        ...msg,
        id: msg._id?.toString() || msg._id,
        sender_id: senderId?.toString() || 'unknown', // FIX: Safe toString with fallback
        created_at: msg.createdAt,
        sender
      };
    })
  );
  return enriched;
}

async function getOrCreateConversation(user1Id, user2Id) {
  const id1 = mongoose.Types.ObjectId.isValid(user1Id) ? user1Id : new mongoose.Types.ObjectId(user1Id);
  const id2 = mongoose.Types.ObjectId.isValid(user2Id) ? user2Id : new mongoose.Types.ObjectId(user2Id);

  let conversation = await Conversation.findOne({
    participants: { $all: [id1, id2] },
    $expr: { $eq: [{ $size: "$participants" }, 2] }
  }).lean();

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [id1, id2]
    });
    conversation = conversation.toObject();
  }

  const participantDetails = await Promise.all(
    conversation.participants.map((pid) => getUserById(pid))
  );

  return {
    ...conversation,
    id: conversation._id.toString(),
    participants: participantDetails
  };
}

/**
 * Get conversations for a user with participant details.
 */
async function getConversationsForUser(userId) {
  const conversations = await Conversation.find({
    participants: userId
  })
    .sort({ lastMessageAt: -1 })
    .lean();

  const enriched = await Promise.all(
    conversations.map(async (conv) => {
      const participantDetails = await Promise.all(
        conv.participants.map((pid) => getUserById(pid))
      );
      const lastMessageContent =
        conv.lastMessage?.content || "";
      return {
        _id: conv._id,
        id: conv._id.toString(),
        participants: participantDetails,
        last_message_content: lastMessageContent,
        last_message_at: conv.lastMessageAt,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt
      };
    })
  );
  return enriched;
}

/**
 * Get a single conversation by ID with enriched participants.
 */
async function getConversationById(conversationId) {
  const conversation = await Conversation.findById(conversationId).lean();
  if (!conversation) return null;

  const participantDetails = await Promise.all(
    conversation.participants.map((pid) => getUserById(pid))
  );
  return {
    ...conversation,
    id: conversation._id.toString(),
    participants: participantDetails
  };
}

/**
 * Mark messages in a conversation as read for the given user (recipient).
 */
async function markMessagesAsRead(conversationId, userId) {
  await Message.updateMany(
    { conversationId, senderId: { $ne: userId }, isRead: false },
    { $set: { isRead: true } }
  );
}

/**
 * Update conversation last message (called by createMessage; exposed for consistency).
 */
async function updateConversationLastMessage(conversationId, message) {
  return Conversation.updateLastMessage(conversationId, message);
}

/**
 * Count unread messages for a user across specified conversations.
 */
async function countUnreadMessages(userId, conversationIds) {
  if (!conversationIds || conversationIds.length === 0) return 0;

  return await Message.countDocuments({
    conversationId: { $in: conversationIds },
    senderId: { $ne: userId },
    isRead: false
  });
}

module.exports = {
  createMessage,
  getMessages,
  getOrCreateConversation,
  getConversationsForUser,
  getConversationById,
  markMessagesAsRead,
  updateConversationLastMessage,
  getUserById,
  countUnreadMessages
};