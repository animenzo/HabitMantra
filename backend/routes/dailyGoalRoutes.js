const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getDailyGoals,
  createDailyGoal,
  updateDailyGoal,
  deleteDailyGoal,
  toggleDailyGoal,
} = require("../controllers/dailyGoalController");

// ALL routes protected
router.get("/", auth, getDailyGoals);
router.post("/", auth, createDailyGoal);
router.patch("/:id/toggle", auth, toggleDailyGoal);
router.patch("/:id", auth, updateDailyGoal);
router.delete("/:id", auth, deleteDailyGoal);

module.exports = router;
