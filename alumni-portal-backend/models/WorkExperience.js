const mongoose = require("mongoose");

const workExperienceSchema = new mongoose.Schema(
  {
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true
    },
    job_title: {
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
    start_date: {
      type: Date,
      required: [true, "Please provide start date"]
    },
    end_date: {
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
    is_current: {
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