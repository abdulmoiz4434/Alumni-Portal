// server.js
const http = require("http");
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const initSocket = require("./config/socket");

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const eventRoutes = require('./routes/events');
const jobRoutes = require('./routes/jobs');
const mentorshipRoutes = require('./routes/mentorship');
const careerInsightsRoutes = require('./routes/careerInsights');
const dashboardRoutes = require('./routes/dashboard');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/(.*)/, cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use("/api/careerInsights", careerInsightsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Alumni Portal API is running!',
    status: 'success'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
