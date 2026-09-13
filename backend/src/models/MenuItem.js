const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Breakfast',
      'Soups & Salads',
      'Starters',
      'Indian Mains',
      'Continental',
      'Sandwiches & Snacks',
      'Desserts',
      'Beverages',
      'Late Night'
    ],
    default: 'Indian Mains'
  },
  image: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountedPrice: {
    type: Number,
    default: null
  },
  currency: {
    type: String,
    default: 'INR'
  },
  foodType: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian', 'vegan'],
    default: 'vegetarian'
  },
  allergens: [{
    type: String,
    enum: ['dairy', 'gluten', 'nuts', 'egg', 'soy', 'seafood', 'shellfish']
  }],
  dietaryTags: [{
    type: String,
    trim: true
  }],
  spiceOptions: [{
    type: String,
    enum: ['mild', 'medium', 'spicy']
  }],
  preparationMinutes: {
    type: Number,
    default: 25
  },
  availableHours: {
    start: { type: String, default: '00:00' },
    end: { type: String, default: '23:59' }
  },
  allowQuantity: {
    type: Boolean,
    default: true
  },
  allowSpecialInstructions: {
    type: Boolean,
    default: true
  },
  optionGroups: [{
    name: { type: String, required: true },
    selectionType: { type: String, enum: ['single', 'multiple'], default: 'single' },
    required: { type: Boolean, default: false },
    options: [{
      name: { type: String, required: true },
      additionalPrice: { type: Number, default: 0 },
      available: { type: Boolean, default: true }
    }]
  }],
  addOns: [{
    name: { type: String, required: true },
    additionalPrice: { type: Number, default: 0 },
    available: { type: Boolean, default: true }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  availability: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isChefSpecial: {
    type: Boolean,
    default: false
  },
  isNewDish: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

menuItemSchema.index({ hotelId: 1, status: 1, availability: 1 });
menuItemSchema.index({ hotelId: 1, category: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
