import React from "react";
import { MdCheckCircle, MdCalendarMonth, MdTrendingUp } from "react-icons/md";

export default function MonthCompareCard({ title, data, monthLabel }) {
  if (!data) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h4>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{monthLabel}</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            {data.completionRate}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-slate-500 block">Completed Days</span>
            <div className="flex items-center gap-1.5 mt-1">
              <MdCheckCircle className="text-emerald-500 text-sm" />
              <span className="text-base font-bold text-slate-900">{data.completedDays}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Days</span>
            <div className="flex items-center gap-1.5 mt-1">
              <MdCalendarMonth className="text-indigo-500 text-sm" />
              <span className="text-base font-bold text-slate-900">{data.totalDays}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
          <span>Overall Consistency</span>
          <span className="text-slate-800 font-bold">{data.completionRate}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(data.completionRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
