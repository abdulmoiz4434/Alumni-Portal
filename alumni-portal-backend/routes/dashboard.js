const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    getDashboardStats,
    getDashboardData,
} = require("../controllers/dashboardController");

router.use(protect);

router.get("/stats", getDashboardStats);

router.get("/data", getDashboardData);

module.exports = router;
