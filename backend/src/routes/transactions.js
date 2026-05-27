const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { validateCreateTransaction, validateUpdateTransaction, validateTransactionQuery } = require('../middleware/validation');
const transactionController = require('../controllers/transactionController');

router.get('/', protect, validateTransactionQuery, transactionController.getTransactions);
router.post('/', protect, validateCreateTransaction, transactionController.createTransaction);
router.get('/:id', protect, transactionController.getTransaction);
router.put('/:id', protect, validateUpdateTransaction, transactionController.updateTransaction);
router.delete('/:id', protect, transactionController.deleteTransaction);

module.exports = router;
