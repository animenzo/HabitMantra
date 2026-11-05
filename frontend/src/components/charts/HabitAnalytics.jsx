import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  MdLocalFireDepartment,
  MdEmojiEvents,
  MdTrendingUp,
} from "react-icons/md";

export default function HabitAnalytics() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics/habits")
      .then((res) => setHabits(res.data || []))
      .catch((err) => console.error("Failed to load habit analytics", err))
      .finally(() => setLoading(false));
  }, []);

  const getTheme = (rate) => {
    if (rate >= 80) {
      return {
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200/70",
        bar: "bg-emerald-500",
      };
    }
    if (rate >= 50) {
      return {
        badge: "bg-indigo-50 text-indigo-800 border-indigo-200/70",
        bar: "bg-indigo-600",
      };
    }
    return {
      badge: "bg-amber-50 text-amber-800 border-amber-200/70",
      bar: "bg-amber-500",
    };
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <MdTrendingUp size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Habit Performance & Streaks
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical consistency and completion rates
            </p>
          </div>
        </div>

        {habits.length > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {habits.length} habits
          </span>
        )}
      </div>

      {loading && (
        <p className="text-center py-10 text-slate-400 text-xs font-medium">
          Loading performance data...
        </p>
      )}

      {!loading && habits.length === 0 && (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-slate-500 text-xs font-medium">No performance data yet.</p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Log habits over multiple days to generate insights and streak analytics.
          </p>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.map((h) => {
          const theme = getTheme(h.completionRate);

          return (
            <div
              key={h.id}
              className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-3.5 hover:border-indigo-200 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4
                    className="font-bold text-slate-850 text-xs truncate max-w-[140px]"
                    title={h.name}
                  >
                    {h.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${theme.badge}`}
                  >
                    {h.completionRate}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full ${theme.bar} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.min(h.completionRate, 100)}%` }}
                  />
                </div>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50">
                <div className="flex items-center gap-1.5">
                  <MdLocalFireDepartment
                    size={16}
                    className={h.streak > 0 ? "text-amber-500" : "text-slate-300"}
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-800 leading-none">
                      {h.streak}d
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600">Streak</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <MdEmojiEvents size={16} className="text-amber-500" />
                  <div>
                    <span className="block text-xs font-bold text-slate-800 leading-none">
                      {h.bestStreak}d
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600">Best</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
