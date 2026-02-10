const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    getDashboardStats,
    getDashboardData,
} = require("../controllers/dashboardController");

// Protect all dashboard routes
router.use(protect);

// Get dashboard statistics
router.get("/stats", getDashboardStats);

// Get dashboard data (events, jobs, mentorships)
router.get("/data", getDashboardData);

module.exports = router;
