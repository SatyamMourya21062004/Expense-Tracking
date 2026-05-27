const Category = require('../models/Category');

// @route   GET /api/categories
// @desc    Get all categories for a user
// @access  Private
exports.getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;

    let filter = { user: req.user.id };

    if (type) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private
exports.createCategory = async (req, res, next) => {
  try {
    const { name, type, color, icon, description } = req.body;

    const category = await Category.create({
      user: req.user.id,
      name,
      type,
      color,
      icon,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/categories/:id
// @desc    Get a single category
// @access  Private
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category belongs to user
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this category' });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category belongs to user
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this category' });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category belongs to user
    if (category.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this category' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
