const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
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
  managerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

departmentSchema.index({ hotelId: 1, name: 1 }, { unique: true });
departmentSchema.index({ hotelId: 1, active: 1 });

module.exports = mongoose.model('Department', departmentSchema);
