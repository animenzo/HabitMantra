import React, { useEffect, useRef } from "react";
import HabitRow from "./HabitRow";

export default function HabitTable({ habits, year, month, refresh }) {
  const scrollContainerRef = useRef(null);

  // Generate days array with Day Name context
  const getDaysArray = () => {
    const totalDays = new Date(year, month, 0).getDate();
    const daysArray = [];
    const today = new Date();

    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() + 1 === month;

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month - 1, i);
      daysArray.push({
        day: i,
        name: date.toLocaleDateString("en-US", { weekday: "narrow" }), // M, T, W
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isToday: isCurrentMonth && today.getDate() === i,
      });
    }
    return daysArray;
  };

  const days = getDaysArray();

  // Auto-scroll to today on mount / month change so mobile users see active date immediately
  useEffect(() => {
    if (scrollContainerRef.current) {
      const todayEl = scrollContainerRef.current.querySelector('[data-is-today="true"]');
      if (todayEl) {
        const container = scrollContainerRef.current;
        const targetLeft = Math.max(0, todayEl.offsetLeft - 150);
        container.scrollTo({
          left: targetLeft,
          behavior: "smooth"
        });
      }
    }
  }, [year, month, habits.length]);

  if (habits.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-300">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
          🎯
        </div>
        <h4 className="text-base font-bold text-slate-800">No habits tracked yet</h4>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Add your first habit above to begin tracking daily consistency and building streaks.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
      {/* Mobile Swipe Hint */}
      <div className="sm:hidden px-3 py-1.5 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
        <span>👈 Swipe horizontally to view all days 👉</span>
        <span className="font-semibold text-indigo-600">Tap to toggle</span>
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto custom-scrollbar touch-pan-x overscroll-x-contain"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 h-14">
              {/* Sticky Header: Habit Name (responsive width) */}
              <th className="sticky left-0 z-30 bg-slate-50/95 px-3 sm:px-4 py-2 text-left text-xs font-bold text-slate-700 w-36 min-w-36 sm:w-48 sm:min-w-48 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)] border-r border-slate-200/80">
                Habit
              </th>

              {/* Scrollable Headers: Days */}
              {days.map((d) => (
                <th
                  key={d.day}
                  data-is-today={d.isToday ? "true" : undefined}
                  className={`px-1 py-2 min-w-8 sm:min-w-9 text-center font-normal select-none ${
                    d.isWeekend ? "bg-slate-100/50" : ""
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        d.isToday ? "text-indigo-600 font-extrabold" : "text-slate-500"
                      }`}
                    >
                      {d.name}
                    </span>
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs transition-colors ${
                        d.isToday
                          ? "bg-indigo-600 text-white font-bold ring-2 ring-indigo-200"
                          : "text-slate-700 font-medium"
                      }`}
                    >
                      {d.day}
                    </span>
                  </div>
                </th>
              ))}

              {/* Status Header: Sticky ONLY on md+ screens so it never covers mobile day cells */}
              <th className="md:sticky md:right-0 z-20 bg-slate-50/95 px-3 py-2 text-center text-xs font-bold text-slate-700 min-w-18 sm:min-w-20 border-l border-slate-200/80 md:shadow-[-2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {habits.map((habit) => (
              <HabitRow
                key={habit._id}
                habit={habit}
                days={days.map((d) => d.day)}
                year={year}
                month={month}
                refresh={refresh}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
