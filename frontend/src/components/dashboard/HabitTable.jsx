import React from "react";
import HabitRow from "./HabitRow";

export default function HabitTable({ habits, year, month, refresh }) {
  // Generate days array with Day Name context
  const getDaysArray = () => {
    const totalDays = new Date(year, month, 0).getDate();
    const daysArray = [];
    const today = new Date();
    
    // Check if the viewed month is the current month (for highlighting)
    const isCurrentMonth = 
      today.getFullYear() === year && 
      (today.getMonth() + 1) === month;

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

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">No habits tracked for this month.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Wrapper for horizontal scroll */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 h-14">
              
              {/* === Sticky Header: Habit Name === */}
              <th className="sticky left-0 z-30 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-700 min-w-40 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] border-r border-gray-200">
                Habit
              </th>

              {/* === Scrollable Headers: Days === */}
              {days.map((d) => (
                <th
                  key={d.day}
                  className={`px-1 py-2 min-w-8 text-center font-normal
                    ${d.isWeekend ? "bg-gray-50/50" : ""}
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-[10px] uppercase font-bold ${d.isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {d.name}
                    </span>
                    <span
                      className={`
                        w-6 h-6 flex items-center justify-center rounded-full text-xs transition-colors
                        ${d.isToday 
                          ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200" 
                          : "text-gray-700"
                        }
                      `}
                    >
                      {d.day}
                    </span>
                  </div>
                </th>
              ))}

              {/* === Sticky Header: Progress === */}
              <th className="sticky  z-30 bg-gray-50 px-4 py-2 text-center text-xs font-semibold text-gray-500 min-w-20 border-l border-gray-200">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {habits.map((habit) => (
              <HabitRow
                key={habit._id}
                habit={habit}
                days={days.map((d) => d.day)} // Pass just numbers to row
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