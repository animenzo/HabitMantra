const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getWeeklyGoals,
  createWeeklyGoal,
  toggleWeeklyGoal,
  updateWeeklyGoal,
  deleteWeeklyGoal,
} = require("../controllers/weeklyGoalController");

router.get("/", auth, getWeeklyGoals);
router.post("/", auth, createWeeklyGoal);
router.patch("/:id/toggle", auth, toggleWeeklyGoal);
router.patch("/:id", auth, updateWeeklyGoal);
router.delete("/:id", auth, deleteWeeklyGoal);

module.exports = router;
