const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerAlumni,
  login,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register routes
router.post('/register/student', registerStudent);
router.post('/register/alumni', registerAlumni);

// Login route
router.post('/login', login);

// Get current user (protected route)
router.get('/me', protect, getMe);

module.exports = router;