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
  getAllUsers,
  uploadProfilePicture,
  deleteUser
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadProfilePicture: uploadMiddleware } = require('../middleware/upload'); // ADD THIS

router.post('/register/student', registerStudent);
router.post('/register/alumni', registerAlumni);

router.post('/login', login);
router.post('/login/admin', adminLogin);

router.get('/me', protect, getMe);
router.get('/user/:id', protect, getUserById);
router.put('/update-profile', protect, updateProfile);

// Profile picture upload route - ADD THIS
router.post('/upload-profile-picture', protect, uploadMiddleware.single('profilePicture'), uploadProfilePicture);

router.get('/all-users', protect, getAllUsers);
router.delete('/delete-user/:userId', protect, deleteUser);
router.get('/verify', protect, getMe);

module.exports = router;