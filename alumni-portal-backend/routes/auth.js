const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerAlumni,
  login,
  adminLogin, // 1. Add this import
  getMe,
  updateProfile,
  getAllUsers
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register/student', registerStudent);
router.post('/register/alumni', registerAlumni);

router.post('/login', login);
router.post('/login/admin', adminLogin); 

router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.get('/all-users', protect, getAllUsers);
router.get('/verify', protect, getMe);

module.exports = router;