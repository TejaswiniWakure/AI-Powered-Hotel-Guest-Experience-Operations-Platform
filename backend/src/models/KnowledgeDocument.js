const mongoose = require('mongoose');
const { KNOWLEDGE_CATEGORIES } = require('../config/constants');

const chunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: [{ type: Number }], // normalized vector representation
  metadata: {
    section: { type: String, default: '' },
    page: { type: Number, default: 1 }
  }
}, { _id: true });

const knowledgeDocumentSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  category: { 
    type: String, 
    enum: KNOWLEDGE_CATEGORIES, 
    default: 'faq' 
  },
  description: { 
    type: String, 
    default: '' 
  },
  originalFile: { 
    type: String, 
    default: '' 
  },
  fileType: {
    type: String,
    default: 'text/markdown'
  },
  content: { 
    type: String, 
    required: true 
  },
  chunks: [chunkSchema],
  status: { 
    type: String, 
    enum: ['processing', 'indexed', 'failed'], 
    default: 'indexed' 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

knowledgeDocumentSchema.index({ hotelId: 1, category: 1 });
knowledgeDocumentSchema.index({ hotelId: 1, status: 1 });

module.exports = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
