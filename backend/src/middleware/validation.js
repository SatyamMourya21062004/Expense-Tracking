const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Authentication validations
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Transaction validations
const validateCreateTransaction = [
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('paymentMethod')
    .isIn(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'other'])
    .withMessage('Valid payment method is required'),
  handleValidationErrors,
];

const validateUpdateTransaction = [
  param('id').isMongoId().withMessage('Valid transaction ID is required'),
  body('category').optional().isMongoId().withMessage('Valid category ID is required'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  handleValidationErrors,
];

// Category validations
const validateCreateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Valid hex color is required'),
  handleValidationErrors,
];

// Budget validations
const validateCreateBudget = [
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('period')
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Valid period is required'),
  body('alertThreshold')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Alert threshold must be between 0 and 100'),
  handleValidationErrors,
];

// Query validations
const validateTransactionQuery = [
  query('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  query('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  query('category').optional().isMongoId().withMessage('Valid category ID is required'),
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateTransaction,
  validateUpdateTransaction,
  validateCreateCategory,
  validateCreateBudget,
  validateTransactionQuery,
};
