const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

    lastMessage: {
      content: { type: String, default: "" },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },

    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

conversationSchema.statics.updateLastMessage = async function (conversationId, message) {
  return this.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: {
        content: message.content,
        sender: message.senderId
      },
      lastMessageAt: message.createdAt || new Date()
    },
    { new: true }
  );
};

module.exports = mongoose.model("Conversation", conversationSchema);