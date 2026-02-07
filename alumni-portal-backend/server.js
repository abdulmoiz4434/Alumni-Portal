const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const jwt = require('jsonwebtoken');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://euchromatic-postnuptially-terri.ngrok-free.dev',
    'https://alumni-portal-pink.vercel.app',
    /\.vercel\.app$/,
    /\.ngrok-free\.dev$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/(.*)/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes); 

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://euchromatic-postnuptially-terri.ngrok-free.dev',
      'https://alumni-portal-pink.vercel.app',
      /\.vercel\.app$/,
      /\.ngrok-free\.dev$/
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);
  socket.on('join_conversation', async (conversationId) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.participants.includes(socket.userId)) {
        return socket.emit('error', 'Unauthorized to join this conversation');
      }

      socket.join(conversationId);
      console.log(`User ${socket.userId} joined room: ${conversationId}`);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('send_message', async (data) => {
  try {
    const { conversationId } = data;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === socket.userId.toString())) {
      return socket.emit('error', 'Unauthorized');
    }
    io.to(conversationId).emit('receive_message', data);
    
    console.log(`Message broadcasted to room ${conversationId}`);
  } catch (err) {
    console.error('Socket send_message error:', err);
  }
});

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Alumni Portal API is running with Socket support!',
    status: 'success' 
  });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});