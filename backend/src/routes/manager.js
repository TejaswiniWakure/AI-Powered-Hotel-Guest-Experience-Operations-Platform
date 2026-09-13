const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// Protected for manager and admin
router.use(protect, authorize(ROLES.MANAGER, ROLES.ADMIN));

router.get('/dashboard', managerController.getDashboard);
router.get('/operations', managerController.getOperations);
router.get('/requests', managerController.getRequests);
router.patch('/requests/:id/reassign', managerController.reassignRequest);
router.patch('/requests/:id/priority', managerController.changePriority);
router.get('/staff', managerController.getStaffOverview);
router.get('/analytics', managerController.getAnalytics);

// Trends
router.get('/trends', managerController.getTrends);
router.post('/trends/:id/action', managerController.takeTrendAction);
router.patch('/trends/:id/dismiss', managerController.dismissTrend);

// Preferences & Offers
router.get('/guest-preferences', managerController.getGuestPreferences);
router.get('/offers', managerController.getOffers);
router.post('/offers/:id/send', managerController.sendOffer);

// Safety & Reports
router.get('/safety', managerController.getSafetyChecks);
router.patch('/safety/:id/complete', managerController.completeSafetyCheck);
router.get('/reports', managerController.getReports);

// Staff Management
router.post('/staff/invite', managerController.inviteStaff);
router.delete('/staff/:id', managerController.removeStaff);

// Menu & In-Room Dining Management
const menuController = require('../controllers/menuController');
router.get('/menu', menuController.getManagerMenuItems);
router.post('/menu', menuController.createMenuItem);
router.get('/menu/settings', menuController.getMenuSettings);
router.put('/menu/settings', menuController.updateMenuSettings);
router.get('/menu/:id', menuController.getMenuItemDetail);
router.put('/menu/:id', menuController.updateMenuItem);
router.patch('/menu/:id/availability', menuController.toggleItemAvailability);
router.patch('/menu/:id/status', menuController.updateItemStatus);
router.post('/menu/:id/duplicate', menuController.duplicateMenuItem);
router.delete('/menu/:id', menuController.deleteMenuItem);

// Food Orders Management
router.get('/food-orders', menuController.getFoodOrders);
router.patch('/food-orders/:id/status', menuController.updateFoodOrderStatus);

module.exports = router;

// Staff management (also accessible to Manager)
