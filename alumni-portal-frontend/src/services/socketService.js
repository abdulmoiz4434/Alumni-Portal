import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
  if (window.location.hostname === "localhost") return "http://localhost:5000";
  return "https://alumni-portal-backend-two.vercel.app";
};

let socket = null;

/**
 * Connect to Socket.IO server with JWT.
 * @param {string} token - JWT from localStorage
 * @returns {Socket|null} socket instance or null if no token
 */
export function connect(token) {
  if (!token) return null;
  if (socket?.connected) return socket;
  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
  return socket;
}

/**
 * Disconnect and clear socket reference.
 */
export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Get current socket instance (may be null if not connected).
 */
export function getSocket() {
  return socket;
}

/**
 * Emit an event to the server.
 */
export function emit(event, data) {
  if (socket?.connected) socket.emit(event, data);
}

/**
 * Listen for an event from the server.
 * @returns {function} unsubscribe function
 */
export function on(event, callback) {
  if (!socket) return () => {};
  socket.on(event, callback);
  // FIX: Add null check before calling .off()
  return () => {
    if (socket) {
      socket.off(event, callback);
    }
  };
}

/**
 * Join a conversation room (so user receives message:new for this conversation).
 */
export function joinConversation(conversationId) {
  if (conversationId && socket?.connected) {
    socket.emit("join:conversation", conversationId);
  }
}

/**
 * Leave a conversation room.
 */
export function leaveConversation(conversationId) {
  if (conversationId && socket?.connected) {
    socket.emit("leave:conversation", conversationId);
  }
}

/**
 * Send a message via Socket.IO (emits message:send).
 */
export function sendMessage(conversationId, content) {
  if (socket?.connected) {
    socket.emit("message:send", { conversationId, content: content.trim() });
  }
}

export default {
  connect,
  disconnect,
  getSocket,
  emit,
  on,
  joinConversation,
  leaveConversation,
  sendMessage,
};