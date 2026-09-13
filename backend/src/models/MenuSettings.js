const mongoose = require('mongoose');

const menuSettingsSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    unique: true,
    index: true
  },
  menuTitle: {
    type: String,
    default: 'In-Room Dining'
  },
  menuDescription: {
    type: String,
    default: 'Freshly prepared meals delivered directly to your room.'
  },
  currency: {
    type: String,
    default: 'INR'
  },
  kitchenHours: {
    breakfast: {
      start: { type: String, default: '06:30' },
      end: { type: String, default: '11:00' }
    },
    allDayDining: {
      start: { type: String, default: '11:00' },
      end: { type: String, default: '23:00' }
    },
    lateNight: {
      start: { type: String, default: '23:00' },
      end: { type: String, default: '06:30' }
    }
  },
  defaultDeliveryMin: {
    type: Number,
    default: 25
  },
  defaultDeliveryMax: {
    type: Number,
    default: 35
  },
  taxPercent: {
    type: Number,
    default: 5
  },
  serviceChargePercent: {
    type: Number,
    default: 10
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  paymentMethods: [{
    type: String,
    enum: ['charge_to_room', 'pay_online', 'cash_on_delivery'],
    default: ['charge_to_room']
  }],
  allowScheduledOrders: {
    type: Boolean,
    default: true
  },
  cancellationWindowMinutes: {
    type: Number,
    default: 2
  },
  kitchenStatus: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  guestNotice: {
    type: String,
    default: 'Please inform us of any food allergies or dietary requirements before ordering.'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuSettings', menuSettingsSchema);
