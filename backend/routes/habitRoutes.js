const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createHabit,
  getHabits,
  toggleHabit,
  updateHabit,
  deleteHabit,
} = require("../controllers/habitController");

// ALL routes are protected
router.post("/", auth, createHabit);
router.get("/", auth, getHabits);
router.patch("/:id/toggle", auth, toggleHabit);
router.put("/:id", auth, updateHabit);
router.delete("/:id", auth, deleteHabit);

module.exports = router;
