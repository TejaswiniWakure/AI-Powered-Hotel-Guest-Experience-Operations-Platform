const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  userName: { 
    type: String, 
    default: 'System' 
  },
  role: { 
    type: String, 
    default: 'system' 
  },
  action: { 
    type: String, 
    required: true 
  },
  resource: { 
    type: String, 
    required: true 
  },
  resourceId: { 
    type: String, 
    default: '' 
  },
  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  ipAddress: { 
    type: String, 
    default: '' 
  }
}, { timestamps: { createdAt: true, updatedAt: false } });

activityLogSchema.index({ hotelId: 1, createdAt: -1 });
activityLogSchema.index({ hotelId: 1, role: 1 });
activityLogSchema.index({ hotelId: 1, action: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
