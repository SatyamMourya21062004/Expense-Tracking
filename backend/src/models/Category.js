const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    icon: {
      type: String,
      default: 'circle',
    },
    description: {
      type: String,
      maxlength: 200,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for user and type combination
categorySchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Category', categorySchema);
