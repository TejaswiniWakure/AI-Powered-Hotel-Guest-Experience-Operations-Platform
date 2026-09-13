const mongoose = require('mongoose');
const { HOTEL_STATUS, SUBSCRIPTION_PLANS, DEFAULT_SLA_MINUTES } = require('../config/constants');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subdomain: { type: String, required: true, unique: true, lowercase: true, trim: true },
  hotelCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    postalCode: { type: String, default: '' }
  },
  contactEmail: { type: String, required: true, lowercase: true },
  contactPhone: { type: String, default: '' },
  hotelType: { type: String, default: '' },
  logo: { type: String, default: '' },
  status: {
    type: String,
    enum: Object.values(HOTEL_STATUS),
    default: HOTEL_STATUS.TRIAL
  },
  subscription: {
    plan: {
      type: String,
      enum: Object.values(SUBSCRIPTION_PLANS),
      default: SUBSCRIPTION_PLANS.PROFESSIONAL
    },
    status: { type: String, default: 'active' },
    price: { type: Number, default: 9999 },
    billingCycle: { type: String, default: 'monthly' },
    nextBillingDate: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    trialEndsAt: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    cancelledAt: { type: Date },
    cancelReason: { type: String }
  },
  limits: {
    maxRooms: { type: Number, default: 100 },
    maxStaff: { type: Number, default: 50 },
    maxRequestsPerMonth: { type: Number, default: 5000 },
    maxAICallsPerMonth: { type: Number, default: 2000 },
    maxStorageGB: { type: Number, default: 10 }
  },
  usage: {
    requests: { type: Number, default: 0 },
    aiCalls: { type: Number, default: 0 },
    storageGB: { type: Number, default: 0 }
  },
  slaSettings: {
    Critical: { response: { type: Number, default: 5 }, resolution: { type: Number, default: DEFAULT_SLA_MINUTES.Critical }, escalation: { type: Number, default: 12 } },
    High: { response: { type: Number, default: 10 }, resolution: { type: Number, default: DEFAULT_SLA_MINUTES.High }, escalation: { type: Number, default: 25 } },
    Medium: { response: { type: Number, default: 15 }, resolution: { type: Number, default: DEFAULT_SLA_MINUTES.Medium }, escalation: { type: Number, default: 50 } },
    Low: { response: { type: Number, default: 30 }, resolution: { type: Number, default: DEFAULT_SLA_MINUTES.Low }, escalation: { type: Number, default: 100 } }
  },
  supportedLanguages: {
    type: [String],
    default: ['English', 'Hindi', 'Marathi', 'French', 'Spanish']
  },
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '11:00' },
  policies: {
    checkIn: { type: String, default: 'Guests must present a valid photo ID upon check-in.' },
    checkOut: { type: String, default: 'Late check-out is subject to availability and extra charges.' },
    cancellation: { type: String, default: 'Free cancellation up to 48 hours before check-in.' },
    pets: { type: String, default: 'Pets are not allowed.' },
    smoking: { type: String, default: 'Non-smoking rooms available. Smoking in designated areas only.' }
  },
  restaurant: {
    name: { type: String, default: '' },
    timings: { type: String, default: '' },
    cuisine: { type: String, default: '' }
  },
  facilities: {
    type: [mongoose.Schema.Types.Mixed],
    default: ['High-speed Wi-Fi', 'Swimming Pool & Deck', '24/7 Room Service', 'Fitness Center', 'Luxury Spa', 'Conference Hall', 'Valet Parking']
  }
}, { timestamps: true });

hotelSchema.index({ status: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
