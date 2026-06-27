const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a goal name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide a target amount'],
      min: [1, 'Target amount must be at least 1'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a deadline'],
    },
    category: {
      type: String,
      enum: ['emergency', 'vacation', 'education', 'investment', 'purchase', 'retirement', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'cancelled'],
      default: 'active',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
GoalSchema.index({ user: 1, status: 1 });
GoalSchema.index({ user: 1, deadline: 1 });

module.exports = mongoose.model('Goal', GoalSchema);
