const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { validateCreateBudget } = require('../middleware/validation');
const budgetController = require('../controllers/budgetController');

router.get('/', protect, budgetController.getBudgets);
router.post('/', protect, validateCreateBudget, budgetController.createBudget);
router.get('/:id', protect, budgetController.getBudget);
router.put('/:id', protect, budgetController.updateBudget);
router.delete('/:id', protect, budgetController.deleteBudget);

module.exports = router;
