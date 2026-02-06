const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerAlumni,
  login,
  getMe,
  updateProfile,
  getAllUsers
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register/student', registerStudent);
router.post('/register/alumni', registerAlumni);

router.post('/login', login);

router.get('/me', protect, getMe);

router.put('/update-profile', protect, updateProfile);

router.get('/all-users', protect, getAllUsers);

router.get('/verify', protect, getMe);

module.exports = router;