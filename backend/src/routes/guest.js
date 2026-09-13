const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { protect } = require('../middleware/auth');

// Public Guest Access Routes (Zero-install entry via Hotel QR)
router.get('/access', guestController.getHotelAccess);
router.post('/verify-room', guestController.verifyRoom);

// Authenticated Guest Session Routes
router.use(protect);

router.get('/session', guestController.getSession);
router.post('/session/logout', guestController.logoutSession);

const menuController = require('../controllers/menuController');

router.get('/dashboard', guestController.getDashboard);
router.get('/services', guestController.getServices);
router.get('/problem-categories', guestController.getProblemCategories);
router.get('/menu', menuController.getGuestMenu);
router.post('/requests/food', menuController.placeFoodOrder);
router.post('/requests/service', guestController.requestService);
router.post('/requests/issue', guestController.reportIssue);
router.get('/requests', guestController.getMyRequests);
router.get('/requests/:id', guestController.getRequestDetail);
router.post('/requests/:id/feedback', guestController.submitFeedback);
router.post('/feedback', guestController.submitGeneralFeedback);
router.post('/concierge/chat', guestController.conciergeChat);
router.get('/concierge/suggestions', guestController.getConciergeSuggestions);
router.get('/notifications', guestController.getNotifications);

module.exports = router;
