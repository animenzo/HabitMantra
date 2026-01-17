const DailyGoal = require("../models/DailyGoals");

/**
 * GET daily goals for a date (YYYY-MM-DD)
 */
exports.getDailyGoals = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "date query parameter is required",
      });
    }

    const goals = await DailyGoal.find({
      date,
      user: req.user.id,
    }).sort({ createdAt: 1 });

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch daily goals",
      error: error.message,
    });
  }
};

/**
 * CREATE daily goal
 */
exports.createDailyGoal = async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        message: "title and date are required",
      });
    }

    const goal = await DailyGoal.create({
      title,
      date,
      completed: false,
      user: req.user.id, // 🔑 owner
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create daily goal",
      error: error.message,
    });
  }
};

/**
 * TOGGLE daily goal completion
 */
exports.toggleDailyGoal = async (req, res) => {
  try {
    const goal = await DailyGoal.findOne({
      _id: req.params.id,
      user: req.user.id, // 🔐 ownership check
    });

    if (!goal) {
      return res.status(404).json({
        message: "Daily goal not found",
      });
    }

    goal.completed = !goal.completed;
    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Failed to toggle daily goal",
      error: error.message,
    });
  }
};

/**
 * UPDATE daily goal title
 */
exports.updateDailyGoal = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const goal = await DailyGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        message: "Daily goal not found",
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update daily goal",
      error: error.message,
    });
  }
};

/**
 * DELETE daily goal
 */
exports.deleteDailyGoal = async (req, res) => {
  try {
    const goal = await DailyGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Daily goal not found",
      });
    }

    res.status(200).json({
      message: "Daily goal deleted successfully",
      goalId: goal._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete daily goal",
      error: error.message,
    });
  }
};
