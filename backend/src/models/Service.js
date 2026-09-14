const mongoose = require('mongoose');
const { PRIORITY_LEVELS, DEFAULT_SLA_MINUTES } = require('../config/constants');

const serviceSchema = new mongoose.Schema({
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
  slug: {
    type: String,
    trim: true,
    lowercase: true
  },
  description: { 
    type: String, 
    default: '' 
  },
  icon: {
    type: String,
    default: ''
  },
  serviceType: {
    type: String,
    enum: ['SERVICE_REQUEST', 'MAINTENANCE', 'ROOM_SERVICE', 'FRONT_DESK', 'INFORMATION'],
    default: 'SERVICE_REQUEST'
  },
  slaMinutes: {
    type: Number,
    default: 30
  },
  estimatedMinutes: {
    type: Number,
    default: 20
  },
  currency: {
    type: String,
    default: 'INR'
  },
  requiresQuantity: {
    type: Boolean,
    default: false
  },
  requiresSchedule: {
    type: Boolean,
    default: false
  },
  requiresPhoto: {
    type: Boolean,
    default: false
  },
  guestVisible: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  category: { 
    type: String, 
    required: true, 
    trim: true 
  },
  departmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    required: true 
  },
  defaultPriority: { 
    type: String, 
    enum: Object.values(PRIORITY_LEVELS), 
    default: PRIORITY_LEVELS.MEDIUM 
  },
  defaultSLAMinutes: { 
    type: Number, 
    default: DEFAULT_SLA_MINUTES.Medium 
  },
  price: {
    type: Number,
    default: 0
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

serviceSchema.index({ hotelId: 1, name: 1 }, { unique: true });
serviceSchema.index({ hotelId: 1, slug: 1 }, { unique: true, sparse: true });
serviceSchema.index({ hotelId: 1, category: 1 });
serviceSchema.index({ hotelId: 1, departmentId: 1 });

module.exports = mongoose.model('Service', serviceSchema);
