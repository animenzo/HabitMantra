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
    let totalCompletions = 0;
    let totalPossible = 0;

    const habitStats = [];

    habits.forEach((h) => {
      let completed = 0;

      h.progress?.forEach((value, date) => {
        totalPossible++;

        if (value === true) {
          completed++;
          totalCompletions++;
          dateSet.add(date);
        }
      });

      habitStats.push({
        name: h.name,
        completed,
      });
    });

    const insights = [];

    if (dateSet.size === 0) {
      return res.json({ insights: ["Start completing habits to see insights 🚀"] });
    }

    /* -------------------------
       1️⃣ Weekday productivity
    ------------------------- */

    const weekdayMap = {
      Sunday: 0, Monday: 0, Tuesday: 0,
      Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0,
    };

    [...dateSet].forEach((date) => {
      const day = new Date(date).toLocaleString("en-US", { weekday: "long" });
      weekdayMap[day]++;
    });

    const bestDay = Object.entries(weekdayMap).sort((a, b) => b[1] - a[1])[0];

    insights.push({
      type: "weekday",
      message: `You are most productive on ${bestDay[0]}s 🔥`,
    });

    /* -------------------------
       2️⃣ Completion rate
    ------------------------- */

    const rate = Math.round((totalCompletions / totalPossible) * 100);

    insights.push({
      type: "rate",
      message: `Your completion rate is ${rate}%`,
    });

    /* -------------------------
       3️⃣ Best habit
    ------------------------- */

    const bestHabit = [...habitStats].sort((a, b) => b.completed - a.completed)[0];

    insights.push({
      type: "bestHabit",
      message: `Your strongest habit is "${bestHabit.name}" 💪`,
    });

    /* -------------------------
       4️⃣ Weak habit
    ------------------------- */

    const worstHabit = [...habitStats].sort((a, b) => a.completed - b.completed)[0];

    insights.push({
      type: "improve",
      message: `"${worstHabit.name}" needs more attention ⚠️`,
    });

    /* -------------------------
       5️⃣ Current streak
    ------------------------- */

    let streak = 0;
    let today = new Date();

    while (true) {
      const d = today.toISOString().split("T")[0];
      if (dateSet.has(d)) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else break;
    }

    insights.push({
      type: "streak",
      message: `Current streak: ${streak} days 🔁`,
    });

    /* -------------------------
       6️⃣ Consistency feedback
    ------------------------- */

    if (dateSet.size < 10) {
      insights.push({
        type: "warning",
        message: "Consistency is low. Try daily small wins 📈",
      });
    } else if (rate > 80) {
      insights.push({
        type: "excellent",
        message: "Excellent consistency! You're unstoppable 🚀",
      });
    } else {
      insights.push({
        type: "good",
        message: "Good progress. Keep pushing 💯",
      });
    }

    /* -------------------------
       7️⃣ Weekly trend
    ------------------------- */

    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split("T")[0]);
    }

    const weekScore = last7Days.filter((d) => dateSet.has(d)).length;

    insights.push({
      type: "weekly",
      message: `You completed habits on ${weekScore}/7 days this week 📅`,
    });

    /* -------------------------
       8️⃣ Motivation
    ------------------------- */

    const motivational = [
      "Small habits create big success 🌱",
      "Consistency beats motivation 💯",
      "You're improving every day 🚀",
      "Keep stacking wins 🔥",
    ];

    insights.push({
      type: "motivation",
      message: motivational[Math.floor(Math.random() * motivational.length)],
    });

    res.json({ insights });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
