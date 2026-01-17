const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
require("dotenv").config();

const habitRoutes = require("./routes/habitRoutes");
const weeklyGoalRoutes = require("./routes/weeklyGoalRoutes");
const dailyGoalRoutes = require("./routes/dailyGoalRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const notesRoutes = require("./routes/notesRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

// Security headers
app.use(helmet());

// Parse JSON
app.use(express.json());

// Parse cookies (🔥 REQUIRED for refresh token)
app.use(cookieParser());

// CORS (🔥 REQUIRED for cookies)
app.use(
  cors({
    origin:["https://habit-mantra-dee3x3xbm-animenzos-projects.vercel.app",
      "https://habit-mantra.vercel.app",
      "http://localhost:5173"
    ], 
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

/* ---------------- DATABASE ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("DB error:", err));

/* ---------------- SERVER ---------------- */
app.get("/",(req,res)=>{
  res.send("Habit Tracker API is running");
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
