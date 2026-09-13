const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
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
  type: { 
    type: String, 
    required: true,
    enum: ['Late Checkout', 'Room Upgrade', 'Spa', 'Dining Offer', 'Other']
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  estimatedAcceptance: { 
    type: Number, 
    default: 75 
  }, // percentage e.g. 78%
  status: { 
    type: String, 
    enum: ['recommended', 'sent', 'accepted', 'rejected', 'dismissed'], 
    default: 'recommended' 
  },
  sentAt: { 
    type: Date 
  },
  acceptedAt: { 
    type: Date 
  },
  rejectedAt: { 
    type: Date 
  }
}, { timestamps: true });

offerSchema.index({ hotelId: 1, status: 1 });
offerSchema.index({ hotelId: 1, guestId: 1 });

module.exports = mongoose.model('Offer', offerSchema);
