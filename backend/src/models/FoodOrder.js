const mongoose = require('mongoose');

const foodOrderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  basePrice: {
    type: Number,
    required: true,
    default: 0
  },
  selectedOptions: [{
    groupName: String,
    optionName: String,
    additionalPrice: { type: Number, default: 0 }
  }],
  selectedAddOns: [{
    name: String,
    additionalPrice: { type: Number, default: 0 }
  }],
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'spicy', null],
    default: null
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  itemTotal: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const foodOrderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    required: true,
    unique: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    index: true
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
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  roomNumber: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: 'room_service'
  },
  items: [foodOrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  serviceCharge: {
    type: Number,
    required: true,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  scheduleType: {
    type: String,
    enum: ['asap', 'scheduled'],
    default: 'asap'
  },
  scheduledAt: {
    type: Date,
    default: null
  },
  deliveryPreference: {
    type: String,
    enum: ['knock', 'leave', 'call'],
    default: 'knock'
  },
  orderNotes: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    enum: ['charge_to_room', 'pay_online', 'cash_on_delivery'],
    default: 'charge_to_room'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'charged_to_room'],
    default: 'charged_to_room'
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'rejected', 'cancelled'],
    default: 'placed',
    index: true
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  estimatedDeliveryAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    at: {
      type: Date,
      default: Date.now
    },
    label: {
      type: String,
      required: true
    },
    note: String
  }]
}, { timestamps: true });

foodOrderSchema.index({ hotelId: 1, createdAt: -1 });

module.exports = mongoose.model('FoodOrder', foodOrderSchema);
