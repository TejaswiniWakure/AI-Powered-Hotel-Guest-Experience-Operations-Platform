const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    enum: ['user', 'assistant', 'system'], 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  sources: [{
    title: String,
    category: String,
    snippet: String
  }],
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  roomNumber: { 
    type: String, 
    default: '' 
  },
  channel: { 
    type: String, 
    enum: ['concierge', 'staff_assistant'], 
    default: 'concierge' 
  },
  messages: [messageSchema]
}, { timestamps: true });

conversationSchema.index({ hotelId: 1, userId: 1, channel: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
