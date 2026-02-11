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
const { getRequests, handleAction } = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

// ============= MENTORSHIP REQUEST ROUTES (MUST COME FIRST!) =============
// These specific routes MUST be before the /:id route
router.get("/requests", protect, getRequests);
router.patch("/requests/:id/:action", protect, handleAction);
router.post('/apply', protect, sendMentorshipRequest);

// ============= MENTORSHIP POST CRUD ROUTES =============
// General routes should come before parameterized routes
router.get("/", getAllMentorships);
router.post("/", protect, createMentorship);

// Parameterized routes should come LAST
router.get("/:id", getMentorshipById);
router.put("/:id", protect, updateMentorship);
router.delete("/:id", protect, deleteMentorship);

module.exports = router;