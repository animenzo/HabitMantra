const express = require('express');
const router = express.Router();

const {getDailyGoals, createDailyGoal, updateDailyGoal, deleteDailyGoal, toggledailyGoal} = require('../controllers/dailyGoalController');

router.get('/', getDailyGoals);
router.post('/', createDailyGoal);
router.patch('/:id', updateDailyGoal);
router.patch('/:id/toggle',toggledailyGoal);

router.delete('/:id', deleteDailyGoal);

module.exports = router