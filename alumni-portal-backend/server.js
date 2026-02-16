require('dotenv').config();

const http = require("http");
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const initSocket = require("./config/socket");

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const eventRoutes = require('./routes/events');
const jobRoutes = require('./routes/jobs');
const mentorshipRoutes = require('./routes/mentorship');
const careerInsightsRoutes = require('./routes/careerInsights');
const dashboardRoutes = require('./routes/dashboard');
const storyRoutes = require('./routes/stories');
const connectionRoutes = require('./routes/connections');

connectDB();

const app = express();

/* ================= CORS ================= */
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/(.*)/, cors());

/* ============== BODY PARSERS ============== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= API ROUTES ================= */
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/careerInsights', careerInsightsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stories', storyRoutes);

/* ================= STATIC FRONTEND ================= */
const frontendPath = path.join(__dirname, '..', 'alumni-portal-frontend', 'dist');
app.use(express.static(frontendPath));

/* ================= API 404 HANDLER ================= */
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

/* ================= SPA FALLBACK ================= */
/*
  Instead of using app.get('*') or app.get('/:any*'),
  use app.use without a path.
  This avoids path-to-regexp parsing entirely.
*/
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ================= SERVER INIT ================= */
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
