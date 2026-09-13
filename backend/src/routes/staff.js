const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

// Protected for staff, manager, admin
router.use(protect, authorize(ROLES.STAFF, ROLES.MANAGER, ROLES.ADMIN));

router.get('/dashboard', staffController.getDashboard);
router.get('/tasks', staffController.getTasks);
router.get('/tasks/:id', staffController.getTaskById);
router.patch('/tasks/:id/accept', staffController.acceptTask);
router.patch('/tasks/:id/start', staffController.startTask);
router.patch('/tasks/:id/complete', staffController.completeTask);
router.post('/tasks/:id/notes', staffController.addNote);
router.patch('/tasks/:id/escalate', staffController.escalateTask);
router.post('/assistant', staffController.askStaffAssistant);
router.get('/performance', staffController.getPerformance);

module.exports = router;
