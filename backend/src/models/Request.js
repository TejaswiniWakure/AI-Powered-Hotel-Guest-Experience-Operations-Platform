const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roomNumber: { type: String, required: true },
  issue: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['New', 'Assigned', 'In Progress', 'Completed'], default: 'New' },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
