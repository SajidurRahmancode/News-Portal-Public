// server/models/News.js
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['politics', 'technology', 'sports', 'entertainment', 'health', 'business']
  },
  image: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add text index for search functionality
newsSchema.index({ title: 'text', content: 'text' });

// Add pagination plugin
newsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('News', newsSchema);