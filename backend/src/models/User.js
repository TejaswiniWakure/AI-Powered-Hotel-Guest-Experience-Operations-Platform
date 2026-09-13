const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(ROLES), 
    default: ROLES.GUEST,
    required: true 
  },
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  departmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  },
  department: { type: String, default: '' },
  employeeId: { type: String, default: '' },
  skills: [{ type: String }],
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room' 
  },
  roomNumber: { type: String, default: '' },
  checkIn: { type: Date },
  checkOut: { type: Date },
  preferences: {
    language: { type: String, default: 'English' },
    pillowType: { type: String, default: 'Soft Feather' },
    housekeepingTime: { type: String, default: 'Morning (10:00 AM)' },
    frequentlyRequested: [{ type: String }]
  },
  active: { type: Boolean, default: true },
  lastLogin: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, { timestamps: true });

// Compound indexes for multi-tenant querying
userSchema.index({ hotelId: 1, email: 1 }, { unique: true });
userSchema.index({ hotelId: 1, role: 1 });
userSchema.index({ hotelId: 1, departmentId: 1 });
userSchema.index({ hotelId: 1, roomNumber: 1 });

// Password hashing middleware
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.password === enteredPassword) return true;
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
