const express = require("express");
const router = express.Router();
const { getCareerInsights } = require("../controllers/careerInsightsController");
const { protect } = require("../middleware/auth");

router.get("/career-data", protect, getCareerInsights);

module.exports = router;