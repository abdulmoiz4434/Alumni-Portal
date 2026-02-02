const mongoose = require("mongoose");

const workExperienceSchema = new mongoose.Schema(
  {
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true
    },
    jobTitle: {
      type: String,
      required: [true, "Please provide job title"],
      trim: true
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
      trim: true
    },
    industry: {
      type: String,
      trim: true,
      default: ""
    },
    location: {
      type: String,
      trim: true,
      default: ""
    },
    startDate: {
      type: Date,
      required: [true, "Please provide start date"]
    },
    endDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          if (value === null) return true;
          return value > this.start_date;
        },
        message: "End date must be after start date"
      }
    },
    isCurrent: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

workExperienceSchema.index({ alumni: 1 });

module.exports = mongoose.model("WorkExperience", workExperienceSchema);