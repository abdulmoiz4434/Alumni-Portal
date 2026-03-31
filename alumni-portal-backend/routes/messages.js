const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getOrCreateConversation,
  sendMessage,
  getMessagesController,
  getConversations
} = require("../controllers/messageController");

router.use(protect);

router.post("/conversation", getOrCreateConversation);

router.post("/send", sendMessage);

router.get("/conversations", getConversations);

router.get("/:conversationId", getMessagesController);

module.exports = router;