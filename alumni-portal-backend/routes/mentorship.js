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
const {
  getMentorshipRequests,
  handleMentorshipAction,
  getMentorshipStatus
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

// ============= MENTORSHIP REQUEST ROUTES =============
router.get("/requests", protect, getMentorshipRequests);
router.get("/status", protect, getMentorshipStatus);
router.patch("/requests/:id/:action", protect, handleMentorshipAction);
router.post('/apply', protect, sendMentorshipRequest);

// ============= MENTORSHIP POST CRUD ROUTES =============
router.get("/", protect, getAllMentorships);
router.post("/", protect, createMentorship);

// Parameterized routes LAST
router.get("/:id", protect, getMentorshipById);
router.put("/:id", protect, updateMentorship);
router.delete("/:id", protect, deleteMentorship);

module.exports = router;