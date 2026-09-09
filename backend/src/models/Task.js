const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: { type: String, required: true },
  status: { type: String, enum: ['New', 'In Progress', 'Completed', 'Escalated'], default: 'New' },
  sla: { type: Date, required: true },
  resolutionNotes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
