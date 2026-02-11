const express = require('express');
const router = express.Router();
const { getStories, createStory, deleteStory } = require('../controllers/storyController'); 
const { protect } = require('../middleware/auth');

router.get('/', getStories);
router.post('/', protect, createStory);
router.delete('/:id', protect, deleteStory);

module.exports = router;