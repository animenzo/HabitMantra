import React from "react";
import { MdCalendarToday } from "react-icons/md";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function MonthPicker({ value, onChange }) {
  const { year, month } = value;

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <MdCalendarToday className="text-indigo-600 text-sm shrink-0" />
        <select
          className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer pr-2"
          value={`${year}-${month}`}
          onChange={(e) => {
            const [y, m] = e.target.value.split("-");
            onChange({ year: Number(y), month: Number(m) });
          }}
        >
          {Array.from({ length: 3 }).map((_, y) => {
            const currentYear = new Date().getFullYear() - y;
            return months.map((m, i) => (
              <option
                key={`${currentYear}-${i + 1}`}
                value={`${currentYear}-${i + 1}`}
              >
                {m} {currentYear}
              </option>
            ));
          })}
        </select>
      </div>
    </div>
  );
}
