const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Adding this so you can display "Posted by: Admin" or the person's name 
    // without doing a heavy database 'populate' every time.
    postedByName: {
      type: String,
      default: "Admin"
    },
    title: {
      type: String,
      required: [true, "Please provide job title"],
      trim: true
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Please provide location"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Please provide job description"],
      trim: true
    },
    // This helps your frontend "Category" filter (Jobs vs Internships)
    category: {
      type: String,
      enum: ["job", "internship"],
      required: true,
      default: "job"
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "remote"],
      required: [true, "Please provide job type"]
    },
    // Added for your card-footer salary display
    salary: {
      type: String,
      trim: true
    },
    requirements: [{ type: String, trim: true }],
    deadline: {
      type: Date,
      required: [true, "Please provide application deadline"]
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);