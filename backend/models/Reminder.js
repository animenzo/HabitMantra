const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  // 👤 Link reminder to user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🏷 Habit info
  title: {
    type: String,
    required: true
  },

  description: String,

  // ⏰ Next trigger time
  nextTriggerAt: {
    type: Date,
    required: true
  },

  // 🔁 Repeat system
  repeatType: {
    type: String,
    enum: ["once", "daily", "weekly", "monthly", "custom"],
    default: "once"
  },

  // only used if repeatType === custom
  intervalMinutes: {
    type: Number,
    default: 0
  },

  // 📅 Weekly days (for weekly habits)
  daysOfWeek: [
    {
      type: Number // 0-6 (Sun-Sat)
    }
  ],

  // 📊 Habit Tracking
  streak: {
    type: Number,
    default: 0
  },

  completedDates: [
    {
      type: Date
    }
  ],

  lastCompletedAt: Date,

  // 🔔 status
  isActive: {
    type: Boolean,
    default: true
  },

  isTriggered: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Reminder", reminderSchema);
