const mongoose = require('mongoose');

const safetyCheckSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Fire Safety',
      'Emergency Exit',
      'Fire Extinguisher',
      'Pool Safety',
      'Kitchen Safety',
      'Electrical Inspection',
      'Maintenance Safety'
    ]
  },
  location: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['completed', 'due_soon', 'overdue'], 
    default: 'due_soon' 
  },
  completionPhoto: { 
    type: String, 
    default: '' 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  completedAt: { 
    type: Date 
  }
}, { timestamps: true });

safetyCheckSchema.index({ hotelId: 1, status: 1, dueDate: 1 });

module.exports = mongoose.model('SafetyCheck', safetyCheckSchema);
