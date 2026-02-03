const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/response');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

exports.registerStudent = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      fullName, 
      regNo, 
      batch, 
      department,
      semester,
      degree
    } = req.body;

    if (!email || !password || !fullName || !regNo || !batch || !department) {
      return errorResponse(res, 'Please provide all required fields (Email, Password, Name, Reg No, Batch, Dept)');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User already exists with this email');
    }

    const regNoExists = await Student.findOne({ regNo });
    if (regNoExists) {
      return errorResponse(res, 'Registration number already exists');
    }

    const user = await User.create({
      email,
      password,
      fullName,
      role: 'student'
    });

    const student = await Student.create({
      user: user._id,
      regNo,
      degree: degree || "BSCS",
      batch,
      department,
      semester: semester || 1,
      cgpa: req.body.cgpa || null,
      skills: req.body.skills || [],
      interests: req.body.interests || [],
      careerGoals: req.body.careerGoals || ''
    });

    const token = generateToken(user._id, user.role);

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profile: student
      }
    }, 201, 'Student registered successfully');

  } catch (error) {
    console.error('Register Student Error:', error);
    return errorResponse(res, error.message || 'Server Error during registration', 500);
  }
};

exports.registerAlumni = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      fullName, 
      graduationYear, // Changed from graduation_year
      regNo,
      department,
      contactNo,
      degree
    } = req.body;

    // 1. Validation check
    if (!email || !password || !fullName || !graduationYear || !regNo || !department) {
      return errorResponse(res, 'Please provide all required fields (Email, Password, Name, Reg No, Grad Year, Dept)');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User already exists with this email');
    }

    const alumniExists = await Alumni.findOne({ regNo });
    if (alumniExists) {
      return errorResponse(res, 'Registration number already exists for an alumni');
    }

    // 2. Create User
    const user = await User.create({
      email,
      password,
      fullName,
      role: 'alumni'
    });

    // 3. Create Alumni Profile
    const alumni = await Alumni.create({
      user: user._id,
      regNo,
      department,
      contactNo,
      degree: degree || "BSCS", 
      graduationYear, // Ensure this matches the variable name at the top
      company: req.body.company || '',
      jobTitle: req.body.jobTitle || '', // Fixed: Changed from job_title to camelCase
      location: req.body.location || '',
      industry: req.body.industry || '',
      skills: req.body.skills || [],
      mentorshipAvailable: req.body.mentorshipAvailable || false // Fixed: Changed from snake_case
    });

    const token = generateToken(user._id, user.role);

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profile: alumni
      }
    }, 201, 'Alumni registered successfully');

  } catch (error) {
    console.error('Register Alumni Error:', error);
    return errorResponse(res, error.message || 'Server Error during registration', 500);
  }
};

exports.login = async (req, res) => {
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
        fullName: user.fullName,
        role: user.role,
        profilePicture: user.profilePicture,
        profile
      }
    }, 200, 'Login successful');
  } catch (error) {
    console.error('Login Error:', error);
    return errorResponse(res, 'Server Error during login', 500);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id });
    } else if (user.role === 'alumni') {
      profile = await Alumni.findOne({ user: user._id });
    }

    return successResponse(res, {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profilePicture: user.profilePicture
      },
      profile: profile
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    return errorResponse(res, 'Server Error fetching profile', 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    // Fields coming from your Profile.jsx handleSave function
    const { about, company, jobTitle, skills, linkedin } = req.body;

    let updatedProfile;

    // Convert skills string to array if necessary
    const skillsArray = typeof skills === 'string' 
      ? skills.split(',').map(s => s.trim()) 
      : skills;

    if (role === 'student') {
      updatedProfile = await Student.findOneAndUpdate(
        { user: userId },
        { 
          $set: { 
            about, 
            skills: skillsArray 
          } 
        },
        { new: true }
      );
    } else if (role === 'alumni') {
      updatedProfile = await Alumni.findOneAndUpdate(
        { user: userId },
        { 
          $set: { 
            about, 
            company, 
            jobTitle, 
            linkedin, 
            skills: skillsArray 
          } 
        },
        { new: true }
      );
    }

    return successResponse(res, updatedProfile, 200, 'Profile updated successfully');
  } catch (error) {
    console.error('Update Profile Error:', error);
    return errorResponse(res, 'Server Error updating profile', 500);
  }
};