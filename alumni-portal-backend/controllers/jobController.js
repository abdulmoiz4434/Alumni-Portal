const Job = require("../models/Job");
const { successResponse, errorResponse } = require("../utils/response");

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

    if (!title || !company || !location || !description || !deadline || !contactEmail) {
      return errorResponse(res, "Please fill all required fields", 400);
    }

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

    return successResponse(res, job, 201, "Job opportunity posted successfully");
  } catch (error) {
    console.error("Error creating job:", error);
    return errorResponse(res, error.message || "Server Error: Could not post job", 500);
  }
};

const getAllJobs = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== 'admin') {
      filter.status = 'active';
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'fullName email')
      .sort({ createdAt: -1 });

    return successResponse(res, jobs, 200, "Jobs fetched successfully");
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return errorResponse(res, "Server Error: Could not fetch jobs", 500);
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return errorResponse(res, "Job not found", 404);
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = job.postedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return errorResponse(res, "Access denied: You can only delete your own posts", 403);
    }

    await Job.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 200, "Job removed successfully");
  } catch (error) {
    console.error("Error deleting job:", error);
    return errorResponse(res, "Server Error: Could not delete job", 500);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  deleteJob
};