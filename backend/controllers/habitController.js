const Habit = require("../models/Habit");

/**
 * CREATE habit
 */
exports.createHabit = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await Habit.create({
      name,
      user: req.user.id, // 🔑 owner
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create habit",
      error: error.message,
    });
  }
};

/**
 * GET all habits for logged-in user
 */
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({
      createdAt: 1,
    });

    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch habits",
      error: error.message,
    });
  }
};

/**
 * TOGGLE habit for a given date (YYYY-MM-DD)
 */
exports.toggleHabit = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id, // 🔐 ownership check
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // ensure progress map exists
    if (!habit.progress) {
      habit.progress = new Map();
    }

    const current = habit.progress.get(date) === true;
    habit.progress.set(date, !current);

    habit.markModified("progress");

    // 🔥 streak calculation
    let streak = 0;
    let day = new Date();

    while (habit.progress.get(day.toISOString().slice(0, 10)) === true) {
      streak++;
      day.setDate(day.getDate() - 1);
    }

    habit.streak = streak;
    habit.bestStreak = Math.max(habit.bestStreak, streak);

    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    console.error("toggleHabit error:", error);
    res.status(500).json({
      message: "Failed to toggle habit",
      error: error.message,
    });
  }
};

/**
 * UPDATE habit name
 */
exports.updateHabit = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name },
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update habit",
      error: error.message,
    });
  }
};

/**
 * DELETE habit
 */
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({
      message: "Habit deleted successfully",
      habitId: habit._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete habit",
      error: error.message,
    });
  }
};
