const DailyGoal = require("../models/DailyGoals")
const Habit = require("../models/Habit");


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
        $project: {
          progressArray: { $objectToArray: "$progress" }
        }
      },
      { $unwind: "$progressArray" },
      {
        $match: {
          "progressArray.v": true,
          "progressArray.k": {
            $gte: startStr,
            $lt: endStr
          }
        }
      },
      {
        $group: {
          _id: "$progressArray.k",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.getYearlyAnalytics = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ message: "Year required" });
    }

    const data = await Habit.aggregate([
      {
        $project: {
          progressArray: { $objectToArray: "$progress" }
        }
      },
      { $unwind: "$progressArray" },
      {
        $match: {
          "progressArray.v": true,
          "progressArray.k": { $regex: `^${year}` }
        }
      },
      {
        $group: {
          _id: {
            $substr: ["$progressArray.k", 0, 7] // YYYY-MM
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getHabitAnalytics = async (req, res) => {
  try {
    const habits = await Habit.find();

    const result = habits.map(h => {
      const total = h.progress ? h.progress.size : 0;
      const completed = h.progress
        ? [...h.progress.values()].filter(Boolean).length
        : 0;

      return {
        id: h._id,
        name: h.name,
        completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
        streak: h.streak,
        bestStreak: h.bestStreak
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const { year, month } = req.query; // month = 01..12
    if (!year || !month) {
      return res.status(400).json({ message: "Year and month required" });
    }

    const prefix = `${year}-${month.padStart(2, "0")}`;

    const data = await Habit.aggregate([
      {
        // 1️⃣ convert Map → array
        $project: {
          progressArray: { $objectToArray: "$progress" }
        }
      },
      { 
        // 2️⃣ flatten dates
        $unwind: "$progressArray" 
      },
      {
        // 3️⃣ only completed days in that month
        $match: {
          "progressArray.v": true,
          "progressArray.k": { $regex: `^${prefix}` }
        }
      },
      {
        // 4️⃣ group by date
        $group: {
          _id: "$progressArray.k",
          count: { $sum: 1 }
        }
      },
      { 
        // 5️⃣ optional sorting
        $sort: { _id: 1 } 
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getHeatmapData = async (req, res) => {
  try {
    const { year } = req.query;

    const data = await Habit.aggregate([
      {
        $project: {
          progressArray: { $objectToArray: "$progress" }
        }
      },
      { $unwind: "$progressArray" },
      {
        $match: {
          "progressArray.v": true,
          "progressArray.k": { $regex: `^${year}` }
        }
      },
      {
        $group: {
          _id: "$progressArray.k",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
      completed: true,
      date: { $gte: start, $lte: end }
    });

    const completionRate = Math.round(
      (completedDays / totalDays) * 100
    );

    res.json({
      year,
      month,
      completedDays,
      totalDays,
      completionRate
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getSmartInsights = async (req, res) => {
  try {
    const habits = await Habit.find();

    const dateSet = new Set();

    habits.forEach(h => {
      h.progress?.forEach((value, date) => {
        if (value === true) dateSet.add(date);
      });
    });

    if (dateSet.size === 0) {
      return res.json({ insights: [] });
    }

    // weekday analysis
    const weekdayMap = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0
    };

    [...dateSet].forEach(date => {
      const day = new Date(date).toLocaleString("en-US", {
        weekday: "long"
      });
      weekdayMap[day]++;
    });

    const bestDay = Object.entries(weekdayMap)
      .sort((a, b) => b[1] - a[1])[0];

    const insights = [
      {
        type: "weekday",
        message: `You are most productive on ${bestDay[0]}s.`
      }
    ];
    const monthMap = {};

    [...dateSet].forEach(date => {
      const d = new Date(date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthMap[key] = (monthMap[key] || 0) + 1;
    });

    const sortedMonths = Object.entries(monthMap).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedMonths.length > 1) {
      const [best, second] = sortedMonths;

      const percent = Math.round(
        ((best[1] - second[1]) / second[1]) * 100
      );

      const bestDate = new Date(
        best[0].split("-")[0],
        best[0].split("-")[1]
      );

      insights.push({
        type: "month",
        message: `${bestDate.toLocaleString("default", {
          month: "long"
        })} was your best month (+${percent}%).`
      });
    }
    if (dateSet.size < 10) {
      insights.push({
        type: "warning",
        message: "Your consistency is low. Try completing habits daily."
      });
    } else {
      insights.push({
        type: "positive",
        message: "You are building strong consistency. Keep going!"
      });
    }

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
