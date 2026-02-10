const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerAlumni,
  login,
  adminLogin,
  getMe,
  getUserById,
  updateProfile,
  getAllUsers
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register/student', registerStudent);
router.post('/register/alumni', registerAlumni);

router.post('/login', login);
router.post('/login/admin', adminLogin);

router.get('/me', protect, getMe);
router.get('/user/:id', protect, getUserById);
router.put('/update-profile', protect, updateProfile);
router.get('/all-users', protect, getAllUsers);
router.get('/verify', protect, getMe);

module.exports = router;