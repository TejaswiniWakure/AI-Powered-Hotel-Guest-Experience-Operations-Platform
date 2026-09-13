const mongoose = require('mongoose');
const { PRIORITY_LEVELS } = require('../config/constants');

const issueTrendSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  subcategory: { 
    type: String, 
    default: '' 
  },
  floor: { 
    type: Number, 
    required: true 
  },
  rooms: [{ 
    type: String 
  }],
  count: { 
    type: Number, 
    required: true 
  },
  timeRange: { 
    type: String, 
    default: '48 hours' 
  },
  severity: { 
    type: String, 
    enum: Object.values(PRIORITY_LEVELS), 
    default: PRIORITY_LEVELS.HIGH 
  },
  insight: { 
    type: String, 
    required: true 
  },
  recommendedAction: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'resolved', 'dismissed'], 
    default: 'active' 
  },
  actionTakenAt: { 
    type: Date 
  },
  actionTaskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  }
}, { timestamps: true });

issueTrendSchema.index({ hotelId: 1, status: 1, createdAt: -1 });
issueTrendSchema.index({ hotelId: 1, category: 1, floor: 1 });

module.exports = mongoose.model('IssueTrend', issueTrendSchema);
