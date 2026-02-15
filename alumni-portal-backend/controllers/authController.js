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
    const normalizedEmail = email.toLowerCase();

    if (!email || !password || !fullName || !regNo || !batch || !department) {
      return errorResponse(res, 'Please provide all required fields (Email, Password, Name, Reg No, Batch, Dept)');
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return errorResponse(res, 'User already exists with this email');
    }

    const regNoExists = await Student.findOne({ regNo });
    if (regNoExists) {
      return errorResponse(res, 'Registration number already exists');
    }

    const user = await User.create({
      email: normalizedEmail,
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
    const message = error.message || 'Server Error during registration';
    return errorResponse(res, message, 500);
  }
};

exports.registerAlumni = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      fullName, 
      graduationYear,
      regNo,
      department,
      contactNo,
      degree
    } = req.body;
    const normalizedEmail = email.toLowerCase();
    if (!email || !password || !fullName || !graduationYear || !regNo || !department) {
      return errorResponse(res, 'Please provide all required fields (Email, Password, Name, Reg No, Grad Year, Dept)');
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return errorResponse(res, 'User already exists with this email');
    }

    const alumniExists = await Alumni.findOne({ regNo });
    if (alumniExists) {
      return errorResponse(res, 'Registration number already exists for an alumni');
    }

    // 2. Create User
    const user = await User.create({
      email: normalizedEmail,
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
    const message = error.message || 'Server Error during registration';
    return errorResponse(res, message, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password');
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (role && user.role !== role) {
      return errorResponse(res, `This account is registered as an ${user.role}. Please use the correct login form.`, 401);
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
    const message = error.message || 'Server Error during login';
    return errorResponse(res, message, 500);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("fullName email role profilePicture")
      .lean();
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, { ...user, _id: user._id, id: user._id }, 200);
  } catch (error) {
    console.error('Get User Error:', error);
    return errorResponse(res, 'Server Error fetching user', 500);
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
    const { 
      fullName, profilePicture, // Fields from User model
      about, company, jobTitle, skills, linkedin, 
      degree, semester, cgpa, careerGoals, interests, location 
    } = req.body;

    // 1. Update User model (fullName, etc.)
    const userUpdateData = {};
    if (fullName) userUpdateData.fullName = fullName;
    if (profilePicture) userUpdateData.profilePicture = profilePicture;

    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(userId, { $set: userUpdateData });
    }

    // 2. Prepare Profile Data
    let updatedProfile;
    const skillsArray = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : []);
    const interestsArray = Array.isArray(interests) ? interests : (typeof interests === 'string' ? interests.split(',').map(i => i.trim()) : []);

    // 3. Update or CREATE (upsert) the specific role profile
    if (role === 'student') {
      updatedProfile = await Student.findOneAndUpdate(
        { user: userId },
        { 
          $set: { 
            about, 
            degree,
            semester: semester ? parseInt(semester) : undefined, 
            cgpa: cgpa ? parseFloat(cgpa) : undefined,           
            careerGoals,
            interests: interestsArray,
            skills: skillsArray 
          } 
        },
        // upsert: true fixes the "Ammar" problem by creating the doc if missing
        { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
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
            location,
            degree,
            skills: skillsArray 
          } 
        },
        { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    if (!updatedProfile) {
      return errorResponse(res, 'Could not update or create profile', 404);
    }

    return successResponse(res, updatedProfile, 200, 'Profile updated successfully');
  } catch (error) {
    console.error('Update Profile Error:', error);
    // Specifically handle duplicate registration number errors
    if (error.code === 11000) {
        return errorResponse(res, 'Registration number already exists', 400);
    }
    return errorResponse(res, 'Server Error updating profile: ' + error.message, 500);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // FIX 1: Use req.user._id instead of req.user.id
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("fullName email role profilePicture")
      .lean();
    
    const detailedUsers = await Promise.all(
      users.map(async (user) => {
        let extra = {};
        if (user.role === "alumni") {
          const alumni = await Alumni.findOne({ user: user._id })
            // FIX 2: Exclude _id from the select to prevent it from overwriting user._id
            .select("department graduationYear batch company jobTitle skills -_id")
            .lean();
          extra = alumni || {};
        } else if (user.role === "student") {
          const student = await Student.findOne({ user: user._id })
            // FIX 2: Exclude _id from the select to prevent it from overwriting user._id
            .select("department batch semester degree skills -_id")
            .lean();
          extra = student || {};
        }
        return { ...user, ...extra };
      })
    );

    return successResponse(res, detailedUsers, 200, "Users fetched successfully");
  } catch (error) {
    console.error("Get All Users Error:", error);
    return errorResponse(res, "Failed to fetch users", 500);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password');
    }

    // 1. Find user and explicitly select password
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // 2. Check if user exists AND if they are an admin
    if (!user || user.role !== 'admin') {
      // We use a generic message for security, but your frontend can handle the 403
      return errorResponse(res, 'Invalid admin credentials or unauthorized access', 403);
    }

    // 3. Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid admin credentials', 401);
    }

    const token = generateToken(user._id, user.role);

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        profilePicture: user.profilePicture
      }
    }, 200, 'Admin login successful');
  } catch (error) {
    console.error('Admin Login Error:', error);
    return errorResponse(res, 'Server Error during admin login', 500);
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No image file provided', 400);
    }

    const userId = req.user.id;
    
    // Cloudinary automatically uploads and returns the URL
    const imageUrl = req.file.path; // Cloudinary URL

    // Update user's profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(
      res, 
      { 
        profilePicture: imageUrl,
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          role: updatedUser.role,
          profilePicture: updatedUser.profilePicture
        }
      }, 
      200, 
      'Profile picture uploaded successfully'
    );
  } catch (error) {
    console.error('Upload Profile Picture Error:', error);
    return errorResponse(res, 'Failed to upload profile picture: ' + error.message, 500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only admins can delete users
    if (req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized. Only admins can delete users.', 403);
    }

    // Prevent admin from deleting themselves
    if (userId === req.user.id || userId === req.user._id.toString()) {
      return errorResponse(res, 'You cannot delete your own account.', 400);
    }

    // Find and delete the user
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Delete associated profile (Student or Alumni)
    if (user.role === 'student') {
      await Student.findOneAndDelete({ user: userId });
    } else if (user.role === 'alumni') {
      await Alumni.findOneAndDelete({ user: userId });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return successResponse(res, null, 200, 'User deleted successfully');
  } catch (error) {
    console.error('Delete User Error:', error);
    return errorResponse(res, 'Failed to delete user', 500);
  }
};