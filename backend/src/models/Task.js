const mongoose = require('mongoose');
const { PRIORITY_LEVELS, TASK_STATUS, DEFAULT_SLA_MINUTES } = require('../config/constants');

const taskNoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  by: { type: String, default: 'Staff' },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  requestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Request', 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  departmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  department: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  priority: { 
    type: String, 
    enum: Object.values(PRIORITY_LEVELS), 
    default: PRIORITY_LEVELS.MEDIUM 
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room' 
  },
  roomNumber: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  aiSummary: { 
    type: String, 
    default: '' 
  },
  assignmentReason: { 
    type: String, 
    default: '' 
  },
  slaMinutes: { 
    type: Number, 
    default: DEFAULT_SLA_MINUTES.Medium 
  },
  slaDeadline: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(TASK_STATUS), 
    default: TASK_STATUS.ASSIGNED 
  },
  startedAt: { 
    type: Date 
  },
  completedAt: { 
    type: Date 
  },
  resolutionTime: { 
    type: Number 
  }, // in minutes
  notes: [taskNoteSchema],
  completionPhoto: { 
    type: String, 
    default: '' 
  },
  resolutionNotes: { 
    type: String, 
    default: '' 
  },
  escalatedAt: { 
    type: Date 
  },
  escalatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  escalationReason: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

taskSchema.index({ hotelId: 1, status: 1, createdAt: -1 });
taskSchema.index({ hotelId: 1, assignedTo: 1, status: 1 });
taskSchema.index({ hotelId: 1, priority: 1 });
taskSchema.index({ hotelId: 1, slaDeadline: 1 });

module.exports = mongoose.model('Task', taskSchema);
