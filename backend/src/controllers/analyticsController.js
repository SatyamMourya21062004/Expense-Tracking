const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

// @route   GET /api/analytics/summary
// @desc    Get monthly and yearly summary
// @access  Private
exports.getSummary = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query; // 'monthly' or 'yearly'

    const now = new Date();
    let startDate;

    if (period === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      income: 0,
      expense: 0,
      balance: 0,
      incomeCount: 0,
      expenseCount: 0,
    };

    transactions.forEach((t) => {
      if (t._id === 'income') {
        summary.income = t.total;
        summary.incomeCount = t.count;
      } else {
        summary.expense = t.total;
        summary.expenseCount = t.count;
      }
    });

    summary.balance = summary.income - summary.expense;

    res.status(200).json({
      success: true,
      period,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/analytics/category-breakdown
// @desc    Get expense/income breakdown by category
// @access  Private
exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const { type, month, year } = req.query;

    const now = new Date();
    const queryYear = year ? parseInt(year) : now.getFullYear();
    const queryMonth = month ? parseInt(month) - 1 : now.getMonth();

    const startDate = new Date(queryYear, queryMonth, 1);
    const endDate = new Date(queryYear, queryMonth + 1, 0);

    const userId = new mongoose.Types.ObjectId(req.user.id);

    let matchStage = {
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    };

    if (type) {
      matchStage.type = type;
    }

    const breakdown = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $project: {
          _id: 1,
          total: 1,
          count: 1,
          categoryName: '$categoryDetails.name',
          categoryType: '$categoryDetails.type',
          categoryColor: '$categoryDetails.color',
          categoryIcon: '$categoryDetails.icon',
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      month: queryMonth + 1,
      year: queryYear,
      data: breakdown,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/analytics/trends
// @desc    Get monthly income/expense trends
// @access  Private
exports.getTrends = async (req, res, next) => {
  try {
    const { months = 12 } = req.query;

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const trends = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format trends data
    const formattedTrends = {};

    trends.forEach((trend) => {
      const key = `${trend._id.year}-${String(trend._id.month).padStart(2, '0')}`;
      if (!formattedTrends[key]) {
        formattedTrends[key] = { income: 0, expense: 0 };
      }
      if (trend._id.type === 'income') {
        formattedTrends[key].income = trend.total;
      } else {
        formattedTrends[key].expense = trend.total;
      }
    });

    const result = Object.keys(formattedTrends)
      .map((key) => ({
        month: key,
        ...formattedTrends[key],
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.status(200).json({
      success: true,
      months: parseInt(months),
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/analytics/budget-vs-actual
// @desc    Get budget vs actual spending comparison
// @access  Private
exports.getBudgetVsActual = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const now = new Date();
    const queryYear = year ? parseInt(year) : now.getFullYear();
    const queryMonth = month ? parseInt(month) - 1 : now.getMonth();

    const startDate = new Date(queryYear, queryMonth, 1);
    const endDate = new Date(queryYear, queryMonth + 1, 0);

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get budgets for expense categories
    const budgets = await Budget.find({ user: userId })
      .populate('category')
      .exec();

    // Get actual spending by category
    const actualSpending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          actual: { $sum: '$amount' },
        },
      },
    ]);

    // Create a map of category -> actual spending
    const spendingMap = {};
    actualSpending.forEach((item) => {
      spendingMap[item._id] = item.actual;
    });

    // Combine budget and actual data
    const comparison = budgets.map((budget) => {
      const actual = spendingMap[budget.category._id] || 0;
      const budgeted = budget.amount;
      const percentUsed = (actual / budgeted) * 100;
      const remaining = Math.max(0, budgeted - actual);
      const exceeded = actual > budgeted;

      return {
        id: budget._id,
        categoryId: budget.category._id,
        categoryName: budget.category.name,
        budgeted,
        actual,
        remaining,
        percentUsed: Math.min(100, percentUsed),
        exceeded,
        alertThreshold: budget.alertThreshold,
        shouldAlert: percentUsed >= budget.alertThreshold,
      };
    });

    res.status(200).json({
      success: true,
      month: queryMonth + 1,
      year: queryYear,
      data: comparison,
    });
  } catch (error) {
    next(error);
  }
};
