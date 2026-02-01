const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/response');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register Student
// @route   POST /api/auth/register/student
// @access  Public
exports.registerStudent = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      email, 
      password, 
      full_name, 
      reg_no, 
      degree, 
      batch, 
      department,
      cgpa,
      skills,
      semester,
      interests,
      career_goals
    } = req.body;

    if (!email || !password || !full_name || !reg_no || !degree || !batch || !department) {
      return errorResponse(res, 'Please provide all required fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User already exists with this email');
    }

    const regNoExists = await Student.findOne({ reg_no });
    if (regNoExists) {
      return errorResponse(res, 'Registration number already exists');
    }

    const user = await User.create([{
      email,
      password,
      full_name,
      role: 'student'
    }], { session });

    const student = await Student.create([{
      user: user[0]._id,
      reg_no,
      degree,
      batch,
      department,
      cgpa: cgpa || null,
      skills: skills || [],
      semester,
      interests: interests || [],
      career_goals: career_goals || ''
    }], { session });

    await session.commitTransaction();

    const token = generateToken(user[0]._id, user[0].role);

    return successResponse(res, {
      token,
      user: {
        id: user[0]._id,
        email: user[0].email,
        full_name: user[0].full_name,
        role: user[0].role,
        profile: student[0]
      }
    }, 201, 'Student registered successfully');
  } catch (error) {
    await session.rollbackTransaction();
    console.error('Register Student Error:', error);
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Register Alumni
// @route   POST /api/auth/register/alumni
// @access  Public
exports.registerAlumni = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      email, 
      password, 
      full_name, 
      degree, 
      graduation_year,
      company,
      job_title,
      location,
      industry,
      skills,
      mentorship_available
    } = req.body;

    if (!email || !password || !full_name || !degree || !graduation_year) {
      return errorResponse(res, 'Please provide all required fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User already exists with this email');
    }

    const user = await User.create([{
      email,
      password,
      full_name,
      role: 'alumni'
    }], { session });

    const alumni = await Alumni.create([{
      user: user[0]._id,
      degree,
      graduation_year,
      company: company || '',
      job_title: job_title || '',
      location: location || '',
      industry: industry || '',
      skills: skills || [],
      mentorship_available: mentorship_available || false
    }], { session });

    await session.commitTransaction();

    const token = generateToken(user[0]._id, user[0].role);

    return successResponse(res, {
      token,
      user: {
        id: user[0]._id,
        email: user[0].email,
        full_name: user[0].full_name,
        role: user[0].role,
        profile: alumni[0]
      }
    }, 201, 'Alumni registered successfully');
  } catch (error) {
    await session.rollbackTransaction();
    console.error('Register Alumni Error:', error);
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    let profile;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id });
    } else if (user.role === 'alumni') {
      profile = await Alumni.findOne({ user: user._id });
    }

    const token = generateToken(user._id, user.role);

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        profile_picture: user.profile_picture,
        profile
      }
    }, 200, 'Login successful');
  } catch (error) {
    console.error('Login Error:', error);
    next(error);
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    let profile;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id });
    } else if (user.role === 'alumni') {
      profile = await Alumni.findOne({ user: user._id });
    }

    return successResponse(res, {
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        profile_picture: user.profile_picture,
        profile
      }
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    next(error);
  }
};