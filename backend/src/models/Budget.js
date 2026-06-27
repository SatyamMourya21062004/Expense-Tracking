const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide a budget amount'],
      min: [0.01, 'Budget must be greater than 0'],
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'monthly',
    },
    startDate: {
      type: Date,
      required: true,
      default: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
    endDate: {
      type: Date,
      required: true,
      default: () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    alertThreshold: {
      type: Number,
      default: 80, // Alert when 80% of budget is spent
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for user and category
budgetSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Budget', budgetSchema);
