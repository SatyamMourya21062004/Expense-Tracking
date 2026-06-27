const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

// @route   GET /api/transactions
// @desc    Get all transactions for a user with filters
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { startDate, endDate, category, type, page = 1, limit = 20, sortBy = 'date' } = req.query;

    let filter = { user: req.user.id };

    // Apply date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Apply category filter
    if (category) {
      filter.category = category;
    }

    // Apply type filter
    if (type) {
      filter.type = type;
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .populate('category', 'name type color icon')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
exports.createTransaction = async (req, res, next) => {
  try {
    const { category, type, amount, description, date, paymentMethod } = req.body;

    // Verify category belongs to user
    const categoryExists = await Category.findOne({ _id: category, user: req.user.id });
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      category,
      type,
      amount,
      description,
      date: date || new Date(),
      paymentMethod,
    });

    await transaction.populate('category', 'name type color icon');

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/transactions/:id
// @desc    Get a single transaction
// @access  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('category');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this transaction' });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this transaction' });
    }

    // Verify new category if provided
    if (req.body.category) {
      const categoryExists = await Category.findOne({ _id: req.body.category, user: req.user.id });
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name type color icon');

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check if transaction belongs to user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this transaction' });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
