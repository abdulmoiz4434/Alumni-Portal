const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    degree: {
      type: String,
      required: [true, "Please provide degree"],
      trim: true
    },
    graduation_year: {
      type: Number,
      required: [true, "Please provide graduation year"],
      min: 1950,
      max: new Date().getFullYear()
    },
    company: {
      type: String,
      trim: true,
      default: ""
    },
    job_title: {
      type: String,
      trim: true,
      default: ""
    },
    location: {
      type: String,
      trim: true,
      default: ""
    },
    industry: {
      type: String,
      trim: true,
      default: ""
    },
    skills: [{ type: String, trim: true }],
    mentorship_available: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

alumniSchema.index({ graduation_year: -1 });

module.exports = mongoose.model("Alumni", alumniSchema);