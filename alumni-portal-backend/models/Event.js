const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: [true, "Please provide event title"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Please provide event description"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Please provide event location"],
      trim: true
    },
    event_date: {
      type: Date,
      required: [true, "Please provide event date"]
    },
    event_time: {
      type: String,
      required: [true, "Please provide event time"],
      trim: true
    },
    event_type: {
      type: String,
      enum: ["reunion", "webinar", "career-fair", "networking", "other"],
      required: [true, "Please provide event type"]
    },
    image_url: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);