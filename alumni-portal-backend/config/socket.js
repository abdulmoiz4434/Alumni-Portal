const { Server } = require("socket.io");
const socketAuth = require("../middleware/socketAuth");
const socketService = require("../services/socketService");

/**
 * Create and configure Socket.IO server attached to HTTP server.
 * @param {http.Server} httpServer - Node HTTP server (from Express)
 * @returns {Server} Socket.IO server instance
 */
function initSocket(httpServer) {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket", "polling"], // ADD THIS
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id} | User: ${socket.user?.fullName || socket.user?._id}`);
    
    // FIX: Attach io instance to socket so it can broadcast messages
    socket.server = io;
    
    socketService.handleConnection(socket);
    
    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });

  console.log("🔌 Socket.IO initialized");
  return io;
}

module.exports = initSocket;
