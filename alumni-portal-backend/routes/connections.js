const express = require('express');
const router = express.Router();
// Added sendConnectionRequest to the destructuring import below
const { 
  getRequests, 
  handleAction, 
  sendConnectionRequest 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth'); 

// GET all pending requests for the logged-in user
router.get('/requests', protect, getRequests);

// ACCEPT or REJECT a request
router.patch('/requests/:id/:action', protect, handleAction);

// SEND a new request (from Directory)
router.post('/send', protect, sendConnectionRequest);

module.exports = router;