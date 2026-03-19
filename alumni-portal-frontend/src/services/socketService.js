import { io } from "socket.io-client";

const getSocketUrl = () => {
  return import.meta.env.MODE === "development" ? "http://localhost:5000" : undefined;
};

let socket = null;

export function connect(token) {
  if (!token) return null;
  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
  }

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

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

export function emit(event, data) {
  if (socket?.connected) socket.emit(event, data);
}

export function on(event, callback) {
  if (!socket) return () => {};
  socket.on(event, callback);

  return () => {
    if (socket) {
      socket.off(event, callback);
    }
  };
}

export function joinConversation(conversationId) {
  if (conversationId && socket?.connected) {
    socket.emit("join:conversation", conversationId);
  }
}

export function leaveConversation(conversationId) {
  if (conversationId && socket?.connected) {
    socket.emit("leave:conversation", conversationId);
  }
}

export function sendMessage(conversationId, content) {
  if (socket?.connected) {
    socket.emit("message:send", { conversationId, content: content.trim() });
  }
}