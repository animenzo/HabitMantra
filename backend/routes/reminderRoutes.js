const express = require("express");
const router = express.Router();

const {
  createReminder,
  getReminders,
  deleteReminder,
  toggleReminder,
  completeReminder
} = require("../controllers/reminderController");

const auth = require("../middleware/auth"); // your JWT middleware


// protect all routes
router.use(auth);


// CRUD
router.post("/", createReminder);
router.get("/", getReminders);
router.delete("/:id", deleteReminder);


// extra features
router.patch("/toggle/:id", toggleReminder);
router.patch("/complete/:id", completeReminder);


module.exports = router;
