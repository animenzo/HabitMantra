import { useEffect, useState, useMemo } from "react";
import {
  getDaysByMonth,
  getLast365Days,
  getMonthLabels,
} from "../utils/heatmapHelpers";
import API from "../services/api";
import { MdCalendarToday, MdChevronLeft, MdChevronRight, MdBarChart } from "react-icons/md";

// Brand-coherent Purple/Indigo heat color function
const getBrandHeatColor = (count) => {
  if (count === 0) return "bg-slate-100 hover:bg-slate-200";
  if (count === 1) return "bg-indigo-200 hover:bg-indigo-300";
  if (count === 2) return "bg-indigo-400 hover:bg-indigo-500 text-white";
  return "bg-indigo-600 hover:bg-indigo-700 text-white";
};

const Heatmap = () => {
  const [data, setData] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [hoveredCell, setHoveredCell] = useState(null);

  const days = useMemo(() => getLast365Days(year), [year]);
  const months = useMemo(() => getDaysByMonth(year), [year]);

  useEffect(() => {
    let cancelled = false;

    API.get(`/analytics/heatmap?year=${year}`)
      .then((res) => {
        if (cancelled) return;
        const map = {};
        (res.data || []).forEach((d) => {
          map[d._id] = d.count;
        });
        setData(map);
      })
      .catch(() => {
        setData({});
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  // Statistics derived from heatmap data
  const heatmapStats = useMemo(() => {
    let totalCompletions = 0;
    let activeDays = 0;

    Object.values(data).forEach((count) => {
      if (count > 0) {
        activeDays += 1;
        totalCompletions += count;
      }
    });

    return { totalCompletions, activeDays };
  }, [data]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <MdBarChart size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Habit Consistency Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily habit execution frequency across {year}
            </p>
          </div>
        </div>

        {/* Stats & Year Picker */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 text-xs font-semibold mr-2">
            <span className="text-slate-600">
              <strong className="text-slate-900 font-bold">{heatmapStats.activeDays}</strong> active days
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              <strong className="text-indigo-600 font-bold">{heatmapStats.totalCompletions}</strong> completions
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
              title="Previous Year"
            >
              <MdChevronLeft size={18} />
            </button>

            <span className="px-2 text-xs font-bold text-slate-800">{year}</span>

            <button
              onClick={() => setYear((y) => y + 1)}
              disabled={year >= new Date().getFullYear()}
              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white disabled:opacity-30 transition-colors"
              title="Next Year"
            >
              <MdChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Heatmap Grid */}
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="inline-flex gap-4 sm:gap-5 min-w-[720px]">
          {months.map((m) => (
            <div key={m.label} className="flex flex-col items-center">
              {/* Month label */}
              <span className="mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {m.label}
              </span>

              {/* Month 7xN grid */}
              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {m.cells.map((date, idx) => {
                  if (!date) {
                    return <div key={idx} className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-0" />;
                  }

                  const count = data[date] || 0;

                  return (
                    <div
                      key={date}
                      onMouseEnter={() => setHoveredCell({ date, count })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`
                        w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md transition-all cursor-pointer
                        ${getBrandHeatColor(count)}
                      `}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="text-slate-600 font-medium">
          {hoveredCell ? (
            <span>
              <strong className="text-slate-900 font-bold">{hoveredCell.date}</strong>:{" "}
              <span className="text-indigo-600 font-bold">{hoveredCell.count}</span> habits completed
            </span>
          ) : (
            <span>Hover over any tile to see daily completion detail.</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="text-[11px]">Less</span>
          <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200/50" />
          <div className="w-3.5 h-3.5 rounded bg-indigo-200" />
          <div className="w-3.5 h-3.5 rounded bg-indigo-400" />
          <div className="w-3.5 h-3.5 rounded bg-indigo-600" />
          <span className="text-[11px]">More</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
