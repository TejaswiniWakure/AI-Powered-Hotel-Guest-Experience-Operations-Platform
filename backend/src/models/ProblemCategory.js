const mongoose = require('mongoose');
const { PRIORITY_LEVELS } = require('../config/constants');

const problemCategorySchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  guestVisible: { 
    type: Boolean, 
    default: true 
  },
  displayOrder: { 
    type: Number, 
    default: 0 
  },
  defaultDepartmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  defaultServiceType: { 
    type: String,
    enum: ['SERVICE_REQUEST', 'MAINTENANCE', 'ROOM_SERVICE', 'FRONT_DESK', 'INFORMATION'],
    default: 'MAINTENANCE'
  },
  suggestedPriority: { 
    type: String, 
    enum: Object.values(PRIORITY_LEVELS), 
    default: PRIORITY_LEVELS.MEDIUM 
  }
}, { timestamps: true });

problemCategorySchema.index({ hotelId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('ProblemCategory', problemCategorySchema);
