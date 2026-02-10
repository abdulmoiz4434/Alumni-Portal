const messageService = require("./messageService");

const CONVERSATION_ROOM_PREFIX = "conversation:";

/**
 * Get serialized message payload for emission.
 */
async function toMessagePayload(msg) {
  const sender = await messageService.getUserById(msg.senderId);
  return {
    id: msg._id.toString(),
    conversationId: msg.conversationId.toString(),
    sender_id: msg.senderId.toString(),
    content: msg.content,
    isRead: msg.isRead,
    created_at: msg.createdAt,
    createdAt: msg.createdAt,
    sender
  };
}

/**
 * Handle new socket connection: join user's personal room.
 */
function handleConnection(socket) {
  const userId = socket.user?._id?.toString();
  if (!userId) return;
  socket.join(`user:${userId}`);
  socket.userId = userId;

  socket.on("join:conversation", (conversationId) => {
    if (!conversationId) return;
    const room = CONVERSATION_ROOM_PREFIX + conversationId;
    socket.join(room);
    socket.emit("joined:conversation", { conversationId });
  });

  socket.on("leave:conversation", (conversationId) => {
    if (!conversationId) return;
    socket.leave(CONVERSATION_ROOM_PREFIX + conversationId);
  });

  socket.on("message:send", async (data) => {
    try {
      const { conversationId, content } = data || {};
      if (!conversationId || !content || !content.trim()) {
        socket.emit("message:error", { message: "Missing conversationId or content" });
        return;
      }
      const senderId = socket.user._id;
      const conversation = await messageService.getConversationById(conversationId);
      if (!conversation) {
        socket.emit("message:error", { message: "Conversation not found" });
        return;
      }
      const isParticipant = conversation.participants.some(
        (p) => (p._id || p).toString() === socket.userId
      );
      if (!isParticipant) {
        socket.emit("message:error", { message: "Not a participant" });
        return;
      }
      const message = await messageService.createMessage(
        conversationId,
        senderId,
        content.trim()
      );
      const payload = await toMessagePayload(message);
      const room = CONVERSATION_ROOM_PREFIX + conversationId;
      socket.server.to(room).emit("message:new", payload);
    } catch (err) {
      console.error("socket message:send error", err);
      socket.emit("message:error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", (reason) => {
    handleDisconnection(socket, reason);
  });
}

/**
 * Handle socket disconnection.
 */
function handleDisconnection(socket, reason) {
  // Cleanup if needed; Socket.IO automatically removes from rooms
}

module.exports = {
  handleConnection,
  handleDisconnection
};
