const express = require('express');
const router = express.Router();
const { 
  getRequests, 
  handleAction, 
  sendConnectionRequest,
  getConnectionStatus,
  getNotificationCount 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth'); 

router.get('/requests', protect, getRequests);

router.get('/status', protect, getConnectionStatus);

router.get('/notification-count', protect, getNotificationCount);

router.patch('/requests/:id/:action', protect, handleAction);

router.post('/send', protect, sendConnectionRequest);

module.exports = router;