const mongoose = require('mongoose');

const aiAnalysisSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  requestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Request' 
  },
  rawInput: { 
    description: String, 
    imageUrl: String 
  },
  result: {
    category: String,
    subcategory: String,
    priority: String,
    confidence: Number,
    keywords: [String],
    detectedIssues: [String],
    summary: String,
    recommendedDepartment: String
  },
  modelUsed: { 
    type: String, 
    default: 'stayflow-hybrid-engine' 
  },
  executionTimeMs: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

aiAnalysisSchema.index({ hotelId: 1, createdAt: -1 });

module.exports = mongoose.model('AiAnalysis', aiAnalysisSchema);
