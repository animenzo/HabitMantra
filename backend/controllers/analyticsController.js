const mongoose = require("mongoose");
const Habit = require("../models/Habit");
const DailyGoal = require("../models/DailyGoals");

/**
 * WEEKLY ANALYTICS
 * ?weekStart=YYYY-MM-DD
 */
exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const { weekStart } = req.query;
    if (!weekStart) {
      return res.status(400).json({ message: "weekStart required" });
    }

    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const data = await Habit.aggregate([
      {
        // 🔑 USER FILTER (MOST IMPORTANT)
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          progressArray: { $objectToArray: "$progress" },
        },
      },
      { $unwind: "$progressArray" },
      {
        $match: {
          "progressArray.v": true,
          "progressArray.k": { $gte: startStr, $lt: endStr },
        },
      },
      {
        $group: {
          _id: "$progressArray.k",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * YEARLY ANALYTICS
 * ?year=YYYY
 */
exports.getYearlyAnalytics = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Year required" });
    }

    const data = await Habit.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          progressArray: { $objectToArray: "$progress" },
        },
      },
      { $unwind: "$progressArray" },
      {
        $match: {
          "progressArray.v": true,
          "progressArray.k": { $regex: `^${year}` },
        },
      },
      {
        $group: {
          _id: { $substr: ["$progressArray.k", 0, 7] }, // YYYY-MM
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * HABIT ANALYTICS (completion rate per habit)
 */
exports.getHabitAnalytics = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });

    const result = habits.map((h) => {
      const total = h.progress ? h.progress.size : 0;
      const completed = h.progress
        ? [...h.progress.values()].filter(Boolean).length
        : 0;

      return {
        id: h._id,
        name: h.name,
        completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
        streak: h.streak,
        bestStreak: h.bestStreak,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * MONTHLY ANALYTICS
 * ?year=YYYY&month=MM
 */
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: "Year and month required" });
    }

    const prefix = `${year}-${month.padStart(2, "0")}`;

    const data = await Habit.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          progressArray: { $objectToArray: "$progress" },
        },
      },
      { $unwind: "$progressArray" },
      {
        $match: {
          "progressArray.v": true,
          "progressArray.k": { $regex: `^${prefix}` },
        },
      },
      {
        $group: {
          _id: "$progressArray.k",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * HEATMAP DATA
 * ?year=YYYY
 */
exports.getHeatmapData = async (req, res) => {
  try {
    const { year } = req.query;

    const data = await Habit.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $project: {
          progressArray: { $objectToArray: "$progress" },
        },
      },
      { $unwind: "$progressArray" },
      {
        $match: {
          "progressArray.v": true,
          "progressArray.k": { $regex: `^${year}` },
        },
      },
      {
        $group: {
          _id: "$progressArray.k",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * COMPARE MONTHLY ANALYTICS
 * ?year=YYYY&month=MM
 */
exports.compareMonthlyAnalytics = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ message: "Year and month required" });
    }

    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).getDate();
    const end = `${year}-${String(month).padStart(2, "0")}-${endDate}`;

    const totalDays = endDate;

    const completedDays = await DailyGoal.countDocuments({
      user: req.user.id,
      completed: true,
      date: { $gte: start, $lte: end },
    });

    const completionRate = Math.round(
      (completedDays / totalDays) * 100
    );

    res.json({
      year,
      month,
      completedDays,
      totalDays,
      completionRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SMART INSIGHTS (USER ONLY)
 */
exports.getSmartInsights = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });

    const dateSet = new Set();

    habits.forEach((h) => {
      h.progress?.forEach((value, date) => {
        if (value === true) dateSet.add(date);
      });
    });

    if (dateSet.size === 0) {
      return res.json({ insights: [] });
    }

    const weekdayMap = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    [...dateSet].forEach((date) => {
      const day = new Date(date).toLocaleString("en-US", { weekday: "long" });
      weekdayMap[day]++;
    });

    const bestDay = Object.entries(weekdayMap).sort((a, b) => b[1] - a[1])[0];

    const insights = [
      {
        type: "weekday",
        message: `You are most productive on ${bestDay[0]}s.`,
      },
    ];

    if (dateSet.size < 10) {
      insights.push({
        type: "warning",
        message: "Your consistency is low. Try completing habits daily.",
      });
    } else {
      insights.push({
        type: "positive",
        message: "You are building strong consistency. Keep going!",
      });
    }

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
