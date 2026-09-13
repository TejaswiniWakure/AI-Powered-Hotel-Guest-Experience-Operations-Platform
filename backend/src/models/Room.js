const mongoose = require('mongoose');
const { ROOM_TYPES, ROOM_STATUS } = require('../config/constants');

const roomSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  roomNumber: { 
    type: String, 
    required: true, 
    trim: true 
  },
  floor: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ROOM_TYPES, 
    default: 'standard' 
  },
  status: { 
    type: String, 
    enum: ROOM_STATUS, 
    default: 'available' 
  },
  guestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hotelId: 1, floor: 1 });
roomSchema.index({ hotelId: 1, status: 1 });

module.exports = mongoose.model('Room', roomSchema);
