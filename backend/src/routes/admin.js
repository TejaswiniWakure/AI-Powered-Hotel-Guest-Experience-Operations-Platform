const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// All admin routes require authentication + admin role
router.use(protect, authorize(ROLES.ADMIN));

router.get('/overview', adminController.getOverview);
router.get('/hotel', adminController.getHotel);
router.patch('/hotel', adminController.updateHotel);

// Rooms
router.get('/rooms', adminController.getRooms);
router.post('/rooms', adminController.createRoom);
router.post('/rooms/generate', adminController.generateRooms);
router.patch('/rooms/:id', adminController.updateRoom);
router.delete('/rooms/:id', adminController.deleteRoom);

// Staff
router.get('/staff', adminController.getStaff);
router.post('/staff', adminController.createStaff);
router.patch('/staff/:id', adminController.updateStaff);
router.delete('/staff/:id', adminController.deleteStaff);

// Departments
router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);
router.patch('/departments/:id', adminController.updateDepartment);
router.delete('/departments/:id', adminController.deleteDepartment);

// Services
router.get('/services', adminController.getServices);
router.post('/services', adminController.createService);
router.patch('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);

// SLA
router.get('/sla', adminController.getSLA);
router.patch('/sla', adminController.updateSLA);

// Knowledge
router.get('/knowledge', adminController.getKnowledgeDocs);
router.post('/knowledge/upload', adminController.uploadKnowledgeDoc);
router.delete('/knowledge/:id', adminController.deleteKnowledgeDoc);

// SaaS Platform Owner Admin Routes
router.get('/platform/overview', adminController.getPlatformOverview);
router.get('/platform/hotels', adminController.getHotelAccounts);
router.post('/platform/hotels', adminController.createHotelAccount);
router.patch('/platform/hotels/:id/suspend', adminController.suspendHotelAccount);
router.patch('/platform/hotels/:id/reactivate', adminController.reactivateHotelAccount);
router.patch('/platform/hotels/:id/extend-trial', adminController.extendHotelTrial);
router.post('/platform/hotels/:id/reset-password', adminController.resetManagerPassword);
router.get('/platform/subscriptions', adminController.getSubscriptions);
router.get('/platform/support-tickets', adminController.getSupportTickets);
router.post('/platform/support-tickets/:id/reply', adminController.replySupportTicket);

module.exports = router;
