const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true,
    index: true 
  },
  requestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Request', 
    required: false,
    default: null
  },
  guestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  guestName: {
    type: String,
    default: ''
  },
  roomNumber: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Overall Stay Experience'
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    default: '' 
  },
  resolutionSatisfied: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

feedbackSchema.index({ hotelId: 1, rating: 1, createdAt: -1 });
feedbackSchema.index({ hotelId: 1, guestId: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
