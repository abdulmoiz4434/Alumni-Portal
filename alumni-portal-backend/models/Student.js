const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
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
    degree: {
      type: String,
      required: false,
      trim: true
    },
    batch: {
      type: String,
      required: [true, "Please provide batch"],
      trim: true
    },
    department: {
      type: String,
      required: [true, "Please provide department"],
      trim: true
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 4,
      default: null
    },
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    careerGoals: {
      type: String,
      trim: true,
      default: ""
    },
    semester: {
      type: Number,
      required: [true, "Please provide your current semester"],
      min: [1, "Semester cannot be less than 1"],
      max: [8, "Semester cannot be more than 8"],
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);