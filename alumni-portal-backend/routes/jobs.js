const express = require("express");
const router = express.Router();
const { 
  createJob, 
  getAllJobs, 
  deleteJob 
} = require("../controllers/jobController");
const { protect, isAdmin } = require("../middleware/auth");

router.get("/", protect, getAllJobs);

router.post("/", protect, createJob);

router.delete("/:id", protect, deleteJob);

module.exports = router;