const WeeklyGoal = require("../models/WeeklyGoal");

/**
 * GET weekly goals for logged-in user
 * Query: ?weekStart=YYYY-MM-DD
 */
exports.getWeeklyGoals = async (req, res) => {
  try {
    const { weekStart } = req.query;

    if (!weekStart) {
      return res.status(400).json({
        message: "weekStart query parameter is required",
      });
    }

    const goals = await WeeklyGoal.find({
      weekStart,
      user: req.user.id,
    }).sort({ createdAt: 1 });

    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch weekly goals",
      error: error.message,
    });
  }
};

/**
 * CREATE a new weekly goal
 */
exports.createWeeklyGoal = async (req, res) => {
  try {
    const { title, weekStart } = req.body;

    if (!title || !weekStart) {
      return res.status(400).json({
        message: "Title and weekStart are required",
      });
    }

    const goal = await WeeklyGoal.create({
      title,
      weekStart,
      user: req.user.id, // 🔑 attach owner
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create weekly goal",
      error: error.message,
    });
  }
};

/**
 * TOGGLE weekly goal completion
 * Params: /:id
 */
exports.toggleWeeklyGoal = async (req, res) => {
  try {
    const goal = await WeeklyGoal.findOne({
      _id: req.params.id,
      user: req.user.id, // 🔐 ownership check
    });

    if (!goal) {
      return res.status(404).json({
        message: "Weekly goal not found",
      });
    }

    goal.completed = !goal.completed;
    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Failed to toggle weekly goal",
      error: error.message,
    });
  }
};

/**
 * UPDATE weekly goal title
 */
exports.updateWeeklyGoal = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const goal = await WeeklyGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        message: "Weekly goal not found",
      });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update weekly goal",
      error: error.message,
    });
  }
};

/**
 * DELETE weekly goal
 */
exports.deleteWeeklyGoal = async (req, res) => {
  try {
    const goal = await WeeklyGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Weekly goal not found",
      });
    }

    res.status(200).json({
      message: "Weekly goal deleted successfully",
      goalId: goal._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete weekly goal",
      error: error.message,
    });
  }
};
