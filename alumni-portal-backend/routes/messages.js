const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getOrCreateConversation,
  sendMessage,
  getMessages,
  getConversations,
} = require("../controllers/messageController");

router.use(protect); // All chat routes require login

router.post("/conversation", getOrCreateConversation);
router.post("/send", sendMessage);
router.get("/conversations", getConversations);
router.get("/:conversationId", getMessages);

module.exports = router;