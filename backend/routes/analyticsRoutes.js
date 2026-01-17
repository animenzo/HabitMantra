const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const analytics = require("../controllers/analyticsController");

router.get("/weekly", auth, analytics.getWeeklyAnalytics);
router.get("/yearly", auth, analytics.getYearlyAnalytics);
router.get("/monthly", auth, analytics.getMonthlyAnalytics);
router.get("/heatmap", auth, analytics.getHeatmapData);
router.get("/habits", auth, analytics.getHabitAnalytics);
router.get("/compare", auth, analytics.compareMonthlyAnalytics);
router.get("/insights", auth, analytics.getSmartInsights);

module.exports = router;
