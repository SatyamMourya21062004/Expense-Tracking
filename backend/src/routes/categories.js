const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { validateCreateCategory } = require('../middleware/validation');
const categoryController = require('../controllers/categoryController');

router.get('/', protect, categoryController.getCategories);
router.post('/', protect, validateCreateCategory, categoryController.createCategory);
router.get('/:id', protect, categoryController.getCategory);
router.put('/:id', protect, categoryController.updateCategory);
router.delete('/:id', protect, categoryController.deleteCategory);

module.exports = router;
