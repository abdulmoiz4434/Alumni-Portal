const { Server } = require("socket.io");
const socketAuth = require("../middleware/socketAuth");
const socketService = require("../services/socketService");

function initSocket(httpServer) {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    socket.server = io;
    socketService.handleConnection(socket);
  });

  console.log("🔌 Socket.IO initialized");
  return io;
}

module.exports = initSocket;