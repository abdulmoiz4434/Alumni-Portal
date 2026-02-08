const express = require("express");
const router = express.Router();
const {
  createMentorship,
  getAllMentorships,
  getMentorshipById,
  updateMentorship,
  deleteMentorship
} = require("../controllers/mentorshipController");
const { protect } = require("../middleware/auth");

router.get("/", getAllMentorships);

router.get("/:id", getMentorshipById);

router.post("/", protect, createMentorship);

router.put("/:id", protect, updateMentorship);

router.delete("/:id", protect, deleteMentorship);

module.exports = router;