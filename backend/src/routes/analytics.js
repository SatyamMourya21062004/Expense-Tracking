const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

router.get('/summary', protect, analyticsController.getSummary);
router.get('/category-breakdown', protect, analyticsController.getCategoryBreakdown);
router.get('/trends', protect, analyticsController.getTrends);
router.get('/budget-vs-actual', protect, analyticsController.getBudgetVsActual);

module.exports = router;
