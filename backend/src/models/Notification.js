const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: [
      'task_assigned', 
      'task_reassigned', 
      'task_completed', 
      'request_created', 
      'request_accepted', 
      'request_completed', 
      'sla_warning', 
      'sla_breached', 
      'escalation', 
      'issue_trend', 
      'safety_alert', 
      'system'
    ]
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  requestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Request' 
  },
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  },
  read: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

notificationSchema.index({ hotelId: 1, userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
