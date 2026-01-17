const express = require('express')
const router = express.Router();

const {
    getWeeklyGoals,
    createWeeklyGoals,
    toggleWeeklyGoal
} = require('../controllers/weeklyGoalController');

router.get("/",getWeeklyGoals)
router.post("/",createWeeklyGoals)
router.patch("/:id/toggle",toggleWeeklyGoal)

module.exports = router;