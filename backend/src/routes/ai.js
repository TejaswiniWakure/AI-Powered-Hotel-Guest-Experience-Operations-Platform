const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/request-understanding', aiController.requestUnderstanding);
router.post('/analyze-issue', aiController.analyzeIssue);
router.post('/concierge', aiController.concierge);
router.post('/staff-assistant', aiController.staffAssistant);

module.exports = router;
