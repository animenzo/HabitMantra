const mongoose = require("mongoose");

const DailyGoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    trim: true,
    default: "",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  dueDate: {
    type: String,
    default: "",
  },
  source: {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
    capturedFrom: {
      type: String,
      trim: true,
      default: "",
    },
  },

  // 🔑 OWNER
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DailyGoal", DailyGoalSchema);
