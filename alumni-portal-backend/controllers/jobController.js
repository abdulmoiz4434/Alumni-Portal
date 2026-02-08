const Job = require("../models/Job");

// @desc    Create a new job/internship
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { 
      title, 
      company, 
      location, 
      description, 
      jobType, 
      category, 
      salary, 
      requirements, 
      deadline,
      contactEmail
    } = req.body;

    // 1. Validation check
    if (!title || !company || !location || !description || !deadline || !contactEmail) {
      return res.status(400).json({ 
        success: false, 
        message: "Please fill all required fields" 
      });
    }

    // 2. Create job
    const job = await Job.create({
      postedBy: req.user._id, 
      postedByName: req.user.fullName || req.user.name || "Admin", 
      title,
      company,
      location,
      description,
      jobType,
      category,
      salary,
      requirements: Array.isArray(requirements) 
        ? requirements 
        : (requirements ? requirements.split(',').map(s => s.trim()) : []),
      deadline,
      contactEmail,
    });

    res.status(201).json({
      success: true,
      data: job,
      message: "Job opportunity posted successfully"
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error: Could not post job" 
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
const getAllJobs = async (req, res) => {
  try {
    let filter = {};

    // Logic: Non-admins see 'active' jobs. 
    // Note: If you want Alumni to see their own 'pending' jobs, 
    // you would adjust this logic. For now, keeping it simple:
    if (req.user.role !== 'admin') {
      filter.status = 'active';
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error: Could not fetch jobs" 
    });
  }
};

// @desc    Delete a job (RBAC: Admin or Owner only)
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: "Job not found" 
      });
    }

    // RBAC logic: 
    // 1. Is the user an admin?
    // 2. Is the user the one who posted it?
    const isAdmin = req.user.role === 'admin';
    const isOwner = job.postedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied: You can only delete your own posts" 
      });
    }
    
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true, 
      message: "Job removed successfully" 
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error: Could not delete job" 
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  deleteJob
};