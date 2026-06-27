const Goal = require('../models/Goal');

// @route   GET /api/goals
// @desc    Get all goals for a user
// @access  Private
exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ deadline: 1 });

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
exports.createGoal = async (req, res, next) => {
  try {
    const { name, targetAmount, currentAmount, deadline, category, priority, notes, color } = req.body;

    const goal = await Goal.create({
      user: req.user.id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      category,
      priority,
      notes,
      color,
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/goals/:id
// @desc    Get a single goal
// @access  Private
exports.getGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
exports.updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Auto-complete if target reached
    if (goal.currentAmount >= goal.targetAmount && goal.status === 'active') {
      goal.status = 'completed';
      await goal.save();
    }

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/goals/:id/contribute
// @desc    Add contribution to a goal
// @access  Private
exports.contributeToGoal = async (req, res, next) => {
  try {
    const { amount } = req.body;

    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    goal.currentAmount += parseFloat(amount);

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Contribution added successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Goal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
