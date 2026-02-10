const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getOrCreateConversation,
  sendMessage,
  getMessagesController,
  getConversations
} = require("../controllers/messageController");

// Protect all chat routes — user must be logged in
router.use(protect);

// Create or get a conversation between two users
router.post("/conversation", getOrCreateConversation);

// Send a message in a conversation
router.post("/send", sendMessage);

// Get all conversations for logged-in user
router.get("/conversations", getConversations);

// Get all messages for a specific conversation
router.get("/:conversationId", getMessagesController);

module.exports = router;