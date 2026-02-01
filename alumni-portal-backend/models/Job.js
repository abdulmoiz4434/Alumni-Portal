const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
    job_type: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      required: [true, "Please provide job type"]
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
