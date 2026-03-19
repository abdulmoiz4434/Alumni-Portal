const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alumnus: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

mentorshipRequestSchema.index({ student: 1, alumnus: 1 });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);