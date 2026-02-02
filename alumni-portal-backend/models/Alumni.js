const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    regNo: {
      type: String,
      required: [true, "Please provide registration number"],
      unique: true,
      trim: true
    },
    about: {
      type: String,
      trim: true,
      default: ""
    },
    department: {
      type: String,
      required: [true, "Please provide department"],
      trim: true
    },
    contactNo: {
      type: String,
      trim: true,
      default: ""
    },
    degree: {
      type: String,
      required: false,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: [true, "Please provide graduation year"],
      min: 1950,
      max: new Date().getFullYear() + 5 
    },
    company: {
      type: String,
      trim: true,
      default: ""
    },
    jobTitle: {
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
    mentorshipAvailable: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

alumniSchema.index({ graduationYear: -1 });
alumniSchema.index({ regNo: 1 });

module.exports = mongoose.model("Alumni", alumniSchema);