const mongoose = require("mongoose");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

async function getUserById(userId) {
  const user = await User.findById(userId).select("fullName email role profilePicture department");
  return user || { _id: userId, fullName: "Unknown User", role: null, profilePicture: null, department: null };
}

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

  if (!messages || messages.length === 0) {
    return [];
  }

  const enriched = await Promise.all(
    messages.map(async (msg) => {
      const senderId = msg.senderId || msg.sender?._id || msg.sender;
      const sender = senderId
        ? await getUserById(senderId)
        : { _id: "unknown", fullName: "Unknown User" };

      return {
        ...msg,
        id: msg._id?.toString() || msg._id,
        sender_id: senderId?.toString() || "unknown",
        created_at: msg.createdAt,
        sender
      };
    })
  );
  return enriched;
}

async function getOrCreateConversation(user1Id, user2Id) {
  if (!mongoose.Types.ObjectId.isValid(user1Id) || !mongoose.Types.ObjectId.isValid(user2Id)) {
    throw new Error("Invalid user ID");
  }

  const id1 = new mongoose.Types.ObjectId(user1Id);
  const id2 = new mongoose.Types.ObjectId(user2Id);

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
      return {
        _id: conv._id,
        id: conv._id.toString(),
        participants: participantDetails,
        last_message_content: conv.lastMessage?.content || "",
        last_message_at: conv.lastMessageAt
      };
    })
  );
  return enriched;
}

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

async function markMessagesAsRead(conversationId, userId) {
  await Message.updateMany(
    { conversationId, senderId: { $ne: userId }, isRead: false },
    { $set: { isRead: true } }
  );
}

async function updateConversationLastMessage(conversationId, message) {
  return Conversation.updateLastMessage(conversationId, message);
}

async function countUnreadMessages(userId, conversationIds) {
  if (!conversationIds || conversationIds.length === 0) return 0;

  return Message.countDocuments({
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