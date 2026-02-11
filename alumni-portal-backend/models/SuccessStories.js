const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  alumnus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);