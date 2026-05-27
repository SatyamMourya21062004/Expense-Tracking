const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  getGoal,
  updateGoal,
  contributeToGoal,
  deleteGoal,
} = require('../controllers/goalController');
const protect = require('../middleware/auth');

router.use(protect);

router.route('/').get(getGoals).post(createGoal);
router.route('/:id').get(getGoal).put(updateGoal).delete(deleteGoal);
router.route('/:id/contribute').put(contributeToGoal);

module.exports = router;
