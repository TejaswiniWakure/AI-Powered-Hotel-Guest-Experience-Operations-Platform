const mongoose = require('mongoose');
const { SUBSCRIPTION_PLANS } = require('../config/constants');

const subscriptionSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true,
    unique: true 
  },
  plan: { 
    type: String, 
    enum: Object.values(SUBSCRIPTION_PLANS), 
    default: SUBSCRIPTION_PLANS.PROFESSIONAL 
  },
  status: { 
    type: String, 
    enum: ['active', 'trialing', 'past_due', 'canceled'], 
    default: 'trialing' 
  },
  price: { 
    type: Number, 
    default: 9999 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  billingPeriod: { 
    type: String, 
    default: 'monthly' 
  },
  currentPeriodStart: { 
    type: Date, 
    default: Date.now 
  },
  currentPeriodEnd: { 
    type: Date, 
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
  },
  trialEndsAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 14 * 24 * 60 * 1000) 
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
