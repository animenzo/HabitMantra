import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import API from "../../services/api";
import { MdChevronLeft, MdChevronRight, MdDateRange } from "react-icons/md";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const WeeklyChart = () => {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [data, setData] = useState(Array(7).fill(0));
  const [loading, setLoading] = useState(false);

  const fetchData = async (start) => {
    try {
      setLoading(true);
      const res = await API.get("/analytics/weekly", {
        params: { weekStart: start.toISOString().slice(0, 10) },
      });

      const counts = Array(7).fill(0);
      (res.data || []).forEach((item) => {
        const dayIndex = new Date(item._id).getDay();
        const index = dayIndex === 0 ? 6 : dayIndex - 1;
        counts[index] = item.count;
      });

      setData(counts);
    } catch (err) {
      console.error("Failed to fetch weekly stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(weekStart);
  }, [weekStart]);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekLabel = `${weekStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const totalThisWeek = data.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Weekly Habit Trend
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {totalThisWeek} done
            </span>
          </div>
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MdDateRange size={12} /> {weekLabel}
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-50 border border-slate-200/80 rounded-xl p-1">
          <button
            onClick={prevWeek}
            className="p-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
            title="Previous Week"
          >
            <MdChevronLeft size={18} />
          </button>
          <button
            onClick={nextWeek}
            className="p-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
            title="Next Week"
          >
            <MdChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-52">
        <Bar
          data={{
            labels: days,
            datasets: [
              {
                data,
                backgroundColor: "rgba(99, 102, 241, 0.8)",
                hoverBackgroundColor: "rgba(79, 70, 229, 1)",
                borderRadius: 8,
                barPercentage: 0.55,
                categoryPercentage: 0.6,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "#0f172a",
                titleFont: { size: 12, weight: "bold" },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                  font: { size: 11, weight: "600" },
                  color: "#64748b",
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  font: { size: 11 },
                  color: "#94a3b8",
                },
                grid: { color: "rgba(226, 232, 240, 0.6)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default WeeklyChart;
