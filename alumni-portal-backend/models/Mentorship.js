const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    postedByName: {
      type: String,
      required: true
    },
    postedByAvatar: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: [true],
      trim: true
    },
    field: {
      type: String,
      required: [true],
      trim: true
    },
    duration: {
      type: String,
      required: [true],
      trim: true
    },
    description: {
      type: String,
      required: [true],
      trim: true
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentorship", mentorshipSchema);