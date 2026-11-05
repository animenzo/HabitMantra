const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const habitRoutes = require("./routes/habitRoutes");
const weeklyGoalRoutes = require("./routes/weeklyGoalRoutes");
const dailyGoalRoutes = require("./routes/dailyGoalRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notesRoutes = require("./routes/notesRoutes");
const authRoutes = require("./routes/authRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const diaryRoutes = require("./routes/diaryRoutes");
const englishRoutes = require("./routes/englishRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const diagramRoutes = require("./routes/diagramRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

// Security headers
app.use(helmet());
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, slow down 🚫",
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);
app.set("trust proxy", 1);
// Parse JSON
app.use(express.json());

// Parse cookies (🔥 REQUIRED for refresh token)
app.use(cookieParser());

// CORS (🔥 REQUIRED for cookies)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "https://habit-mantra-dee3x3xbm-animenzos-projects.vercel.app",
        "https://habit-mantra.vercel.app",
      ];

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        origin.startsWith("chrome-extension://");

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

/* ---------------- ROUTES ---------------- */

// Auth (PUBLIC)
app.use("/auth", authRoutes);

// Protected APIs
app.use("/habits", habitRoutes);
app.use("/weekly-goals", weeklyGoalRoutes);
app.use("/daily-goals", dailyGoalRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/notes", notesRoutes);
app.use("/reminders", reminderRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/diary", diaryRoutes);
app.use("/diaries", diaryRoutes);
app.use("/english", englishRoutes);
app.use("/assistant", assistantRoutes);
app.use("/timetable", timetableRoutes);
app.use("/diagrams", diagramRoutes);


/* ---------------- DATABASE ---------------- */

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    require('./utils/reminderCron');
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
}
connectDB();

/* ---------------- SERVER ---------------- */
app.get("/", (req, res) => {
  res.send("Habit Tracker API is running");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
