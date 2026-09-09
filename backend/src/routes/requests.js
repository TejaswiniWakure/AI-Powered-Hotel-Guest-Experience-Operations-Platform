const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { protect } = require('../middleware/auth');

// @route GET /api/requests
router.get('/', protect, async (req, res) => {
  try {
    const requests = await Request.find().populate('guestId', 'name roomNumber');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/requests
router.post('/', protect, async (req, res) => {
  try {
    const request = new Request({
      ...req.body,
      guestId: req.user._id
    });
    const createdRequest = await request.save();
    
    // Emit event for real-time update
    req.io.emit('newRequest', createdRequest);
    
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
