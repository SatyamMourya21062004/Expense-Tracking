const User = require('../models/User');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

// Default categories for new users
const DEFAULT_CATEGORIES = [
  // Expense categories
  { name: 'Food & Dining', type: 'expense', color: '#f59e0b', icon: 'utensils' },
  { name: 'Transport', type: 'expense', color: '#3b82f6', icon: 'car' },
  { name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'shopping-bag' },
  { name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: 'video' },
  { name: 'Bills & Utilities', type: 'expense', color: '#ef4444', icon: 'file-text' },
  { name: 'Healthcare', type: 'expense', color: '#10b981', icon: 'heart' },
  { name: 'Education', type: 'expense', color: '#06b6d4', icon: 'book' },
  { name: 'Other', type: 'expense', color: '#64748b', icon: 'tag' },
  // Income categories
  { name: 'Salary', type: 'income', color: '#10b981', icon: 'briefcase' },
  { name: 'Freelance', type: 'income', color: '#f59e0b', icon: 'code' },
  { name: 'Investment', type: 'income', color: '#3b82f6', icon: 'trending-up' },
  { name: 'Bonus', type: 'income', color: '#8b5cf6', icon: 'gift' },
  { name: 'Other Income', type: 'income', color: '#64748b', icon: 'tag' },
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
    });

    // Create default categories for the new user
    const categoriesWithUserId = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      user: user._id,
    }));
    
    await Category.insertMany(categoriesWithUserId);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          currency: user.currency,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          currency: user.currency,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, currency } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, currency },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token deletion)
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
