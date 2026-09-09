const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/auth');

// @route GET /api/tasks
router.get('/', protect, authorize('staff', 'manager', 'admin'), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'staff') {
      // Staff only sees their tasks or unassigned department tasks
      query = { 
        $or: [
          { assignedTo: req.user._id },
          { department: req.user.department, assignedTo: null }
        ]
      };
    }
    
    const tasks = await Task.find(query).populate({
      path: 'requestId',
      select: 'roomNumber issue category priority'
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/tasks/:id/status
router.put('/:id/status', protect, authorize('staff', 'manager'), async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.status = status;
    if (resolutionNotes) task.resolutionNotes = resolutionNotes;
    
    const updatedTask = await task.save();
    
    // Emit update event
    req.io.emit('taskUpdated', updatedTask);
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
