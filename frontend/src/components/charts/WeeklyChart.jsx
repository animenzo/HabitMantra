import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import API from "../../services/api";

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

  const fetchData = async (start) => {
    const res = await API.get("/analytics/weekly", {
      params: { weekStart: start.toISOString().slice(0, 10) }
    });

    const counts = Array(7).fill(0);
    res.data.forEach((item) => {
      const dayIndex = new Date(item._id).getDay();
      const index = dayIndex === 0 ? 6 : dayIndex - 1;
      counts[index] = item.count;
    });

    setData(counts);
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

  const weekLabel = `${weekStart.toDateString()} – ${new Date(
    new Date(weekStart).setDate(weekStart.getDate() + 6)
  ).toDateString()}`;

  return (
    <div className="relative rounded-2xl p-4 sm:p-5 bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl w-full">
      
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/20 to-purple-500/20 blur-2xl -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm sm:text-md font-semibold text-gray-800">
            Weekly Progress
          </h3>
          <p className="text-xs text-gray-500">
            {weekLabel}
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={prevWeek}
            className="px-3 py-1 rounded-md bg-white/80 hover:bg-white/60 text-xs sm:text-sm"
          >
            Prev
          </button>
          <button
            onClick={nextWeek}
            className="px-3 py-1 rounded-md bg-white/80 hover:bg-white/60 text-xs sm:text-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full overflow-hidden">
        <Bar
          data={{
            labels: days,
            datasets: [
              {
                data,
                backgroundColor: "rgba(79,70,229,0.65)",
                hoverBackgroundColor: "rgba(79,70,229,0.85)",
                borderRadius: 6,
                barPercentage: 0.6,
                categoryPercentage: 0.6
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 10 } }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 2,
                  font: { size: 10 }
                },
                grid: { color: "rgba(0,0,0,0.05)" }
              }
            }
          }}
          height={220}
        />
      </div>
    </div>
  );
};

export default WeeklyChart;
