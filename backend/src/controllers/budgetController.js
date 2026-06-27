const Budget = require('../models/Budget');
const Category = require('../models/Category');

// @route   GET /api/budgets
// @desc    Get all budgets for a user
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user.id })
      .populate('category', 'name type color icon')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
exports.createBudget = async (req, res, next) => {
  try {
    const { category, amount, period, alertThreshold, description } = req.body;

    // Verify category belongs to user
    const categoryExists = await Category.findOne({ _id: category, user: req.user.id });
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if budget already exists for this category
    const existingBudget = await Budget.findOne({ category, user: req.user.id });
    if (existingBudget) {
      return res.status(400).json({ success: false, message: 'Budget already exists for this category' });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category,
      amount,
      period,
      alertThreshold,
      description,
    });

    await budget.populate('category', 'name type color icon');

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/budgets/:id
// @desc    Get a single budget
// @access  Private
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id).populate('category');

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this budget' });
    }

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
exports.updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this budget' });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name type color icon');

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    // Check if budget belongs to user
    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this budget' });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
