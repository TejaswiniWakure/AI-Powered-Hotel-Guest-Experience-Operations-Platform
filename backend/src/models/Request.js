const mongoose = require('mongoose');
const { PRIORITY_LEVELS, REQUEST_STATUS, DEFAULT_SLA_MINUTES } = require('../config/constants');

const timelineItemSchema = new mongoose.Schema({
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  by: { type: String, default: 'System' },
  note: { type: String, default: '' }
}, { _id: false });

const requestSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  guestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room' 
  },
  roomNumber: { 
    type: String, 
    required: true 
  },
  location: {
    type: String,
    default: 'Room'
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  quantity: {
    type: Number,
    default: 1
  },
  requestedTime: {
    type: Date
  },
  type: { 
    type: String, 
    enum: ['service', 'issue'], 
    default: 'service' 
  },
  category: { 
    type: String, 
    required: true 
  },
  subcategory: { 
    type: String, 
    default: '' 
  },
  description: { 
    type: String, 
    required: true 
  },
  images: [{ 
    type: String 
  }],
  priority: { 
    type: String, 
    enum: Object.values(PRIORITY_LEVELS), 
    default: PRIORITY_LEVELS.MEDIUM 
  },
  departmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  department: { 
    type: String, 
    default: '' 
  },
  slaMinutes: { 
    type: Number, 
    default: DEFAULT_SLA_MINUTES.Medium 
  },
  slaDeadline: { 
    type: Date 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  status: { 
    type: String, 
    enum: Object.values(REQUEST_STATUS), 
    default: REQUEST_STATUS.NEW 
  },
  aiAnalysis: {
    category: { type: String },
    subcategory: { type: String },
    confidence: { type: Number },
    priority: { type: String },
    detectedIssues: [{ type: String }],
    keywords: [{ type: String }],
    summary: { type: String }
  },
  timeline: [timelineItemSchema],
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    resolutionSatisfied: { type: Boolean },
    createdAt: { type: Date }
  },
  completedAt: { type: Date },
  resolutionTime: { type: Number } // in minutes
}, { timestamps: true });

requestSchema.index({ hotelId: 1, status: 1, createdAt: -1 });
requestSchema.index({ hotelId: 1, guestId: 1, createdAt: -1 });
requestSchema.index({ hotelId: 1, assignedTo: 1, status: 1 });
requestSchema.index({ hotelId: 1, category: 1, createdAt: -1 });
requestSchema.index({ hotelId: 1, departmentId: 1 });
requestSchema.index({ hotelId: 1, roomNumber: 1 });

module.exports = mongoose.model('Request', requestSchema);
