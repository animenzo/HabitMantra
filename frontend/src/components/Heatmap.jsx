import { useEffect, useState, useMemo } from "react";
import {
  getDaysByMonth,
  getHeatColor,
  getLast365Days,
  getMonthLabels,
} from "../utils/heatmapHelpers";
import API from "../services/api";

const Heatmap = () => {
  const CELL = 18; // w-4 = 16px
  const GAP = 4; // gap-1 = 4px
  const COL_WIDTH = CELL + GAP;

  const [data, setData] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());

  // recompute days only when year changes
  const days = useMemo(() => getLast365Days(year), [year]);
  const monthLabels = useMemo(() => getMonthLabels(days), [days]);
  const months = useMemo(() => getDaysByMonth(year), [year]);

  useEffect(() => {
    let cancelled = false;

    API.get(`/analytics/heatmap?year=${year}`)
      .then((res) => {
        if (cancelled) return;

        const map = {};
        res.data.forEach((d) => {
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
  const totalWeeks = Math.ceil(days.length / 7);

  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Activity</h3>

        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setYear((y) => y - 1)}
            className="px-2 py-1 rounded hover:bg-gray-100"
          >
            ◀
          </button>

          <span className="font-medium">{year}</span>

          <button
            onClick={() => setYear((y) => y + 1)}
            disabled={year >= new Date().getFullYear()}
            className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div className="overflow-x-auto">
        <div className="flex gap-6">
          {months.map((m) => (
            <div key={m.label} className="flex flex-col items-center">
              {/* Month label */}
              <span className="mb-2 text-xs text-gray-400">{m.label}</span>

              {/* Month grid */}
              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {m.cells.map((date, idx) => {
                  if (!date) {
                    return <div key={idx} className="w-4 h-4" />;
                  }

                  const count = data[date] || 0;

                  return (
                    <div
                      key={date}
                      title={`${date}: ${count}`}
                      className={`
                  w-4 h-4 rounded-md
                  ${getHeatColor(count)}
                  hover:ring-1 hover:ring-gray-400
                `}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 mt-4 text-xs sm:text-sm text-gray-600">
        <span>Less</span>
        <div className="w-3 h-3 bg-gray-200 rounded" />
        <div className="w-3 h-3 bg-green-200 rounded" />
        <div className="w-3 h-3 bg-green-400 rounded" />
        <div className="w-3 h-3 bg-green-600 rounded" />
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
