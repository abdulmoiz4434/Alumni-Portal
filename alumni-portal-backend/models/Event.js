const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    createdBy: {
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
    eventDate: {
      type: Date,
      required: [true, "Please provide event date"]
    },
    eventTime: {
      type: String,
      required: [true, "Please provide event time"],
      trim: true
    },
    eventType: {
      type: String,
      enum: ["reunion", "webinar", "career-fair", "networking", "other"],
      required: [true, "Please provide event type"]
    },
    imageUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);