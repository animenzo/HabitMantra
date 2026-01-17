const express = require("express");
const router = express.Router();

const {
  getWeeklyAnalytics,
  getYearlyAnalytics,
  getHabitAnalytics,
  getHeatmapData,
  getMonthlyAnalytics,
  compareMonthlyAnalytics,
  getSmartInsights
} = require("../controllers/analyticsController");

router.get("/weekly", getWeeklyAnalytics);
router.get("/monthly", getMonthlyAnalytics);
router.get("/heatmap", getHeatmapData);

router.get("/yearly", getYearlyAnalytics);
router.get("/habits", getHabitAnalytics);
router.get("/comparemonthly",compareMonthlyAnalytics)
router.get("/insights", getSmartInsights);
module.exports = router;
