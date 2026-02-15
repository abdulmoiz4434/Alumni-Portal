const express = require("express");
const router = express.Router();
const {
  createMentorship,
  getAllMentorships,
  getMentorshipById,
  updateMentorship,
  deleteMentorship,
  sendMentorshipRequest
} = require("../controllers/mentorshipController");
const { getRequests, handleAction, getMentorshipStatus } = require("../controllers/notificationController"); // ADD getMentorshipStatus
const { protect } = require("../middleware/auth");

// ============= MENTORSHIP REQUEST ROUTES (MUST BE FIRST!) =============
router.get("/requests", protect, getRequests);
router.get("/status", protect, getMentorshipStatus); // ADD THIS LINE
router.patch("/requests/:id/:action", protect, handleAction);
router.post('/apply', protect, sendMentorshipRequest);

// ============= MENTORSHIP POST CRUD ROUTES =============
router.get("/", getAllMentorships);
router.post("/", protect, createMentorship);

// Parameterized routes LAST
router.get("/:id", getMentorshipById);
router.put("/:id", protect, updateMentorship);
router.delete("/:id", protect, deleteMentorship);

module.exports = router;