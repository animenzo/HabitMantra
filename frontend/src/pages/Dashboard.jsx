import React, { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import { formatDate } from "../utils/dateHelpers";
import HabitForm from "../components/dashboard/HabitForm";
import HabitTable from "../components/dashboard/HabitTable";
import MonthNavigation from "../components/dashboard/MonthNavigation";
import DailyGoals from "../components/dashboard/DailyGoals";
import WeeklyGoals from "../components/dashboard/WeeklyGoals";
import SmartInsights from "../components/dashboard/SmartInsights";
import HabitAnalytics from "../components/charts/HabitAnalytics";
import Reminder from "../components/dashboard/Reminder";
import {
  MdCheckCircle,
  MdLocalFireDepartment,
  MdTrendingUp,
  MdCalendarMonth,
} from "react-icons/md";

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const load = async () => {
    try {
      const res = await API.get("/habits");
      setHabits(res.data || []);
    } catch (error) {
      console.error("Failed to load habits", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Compute Summary Metrics
  const summaryStats = useMemo(() => {
    const todayStr = formatDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );

    const completedToday = habits.filter(
      (h) => h.progress && h.progress[todayStr]
    ).length;

    const totalHabits = habits.length;
    const todayRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    // Calculate maximum current streak
    let maxStreak = 0;
    habits.forEach((h) => {
      if (h.streak && h.streak > maxStreak) {
        maxStreak = h.streak;
      }
    });

    return {
      totalHabits,
      completedToday,
      todayRate,
      maxStreak,
    };
  }, [habits]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* ================= PAGE HEADER & SUMMARY STRIP ================= */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-2 border-b border-slate-200/70">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Habits & Momentum
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Focus on consistency, execute daily goals, and build lasting routines.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-xs">
              <span className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Today
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MdCheckCircle className="text-emerald-500 text-base" />
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {summaryStats.completedToday}/{summaryStats.totalHabits}
                </span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-xs">
              <span className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Completion
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MdTrendingUp className="text-indigo-600 text-base" />
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {summaryStats.todayRate}%
                </span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-xs">
              <span className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Top Streak
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MdLocalFireDepartment className="text-amber-500 text-base" />
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {summaryStats.maxStreak}d
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= HABIT TRACKER MATRIX ================= */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          {/* Card Top Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <MdCalendarMonth size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Monthly Habit Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track individual day completion across the month
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <MonthNavigation
                year={year}
                month={month}
                setMonth={setMonth}
                setYear={setYear}
              />
              <span className="hidden sm:block h-6 w-px bg-slate-200" />
              <HabitForm refresh={load} />
            </div>
          </div>

          {/* Table */}
          <HabitTable
            habits={habits}
            year={year}
            month={month}
            refresh={load}
          />
        </section>

        {/* ================= GOALS EXECUTION ROW ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <DailyGoals />
          <WeeklyGoals />
        </section>

        {/* ================= INSIGHTS, REMINDERS & PERFORMANCE ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <Reminder />
            <SmartInsights />
          </div>

          <div>
            <HabitAnalytics />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
