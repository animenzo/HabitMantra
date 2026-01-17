import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import API from "../../services/api";

const getMonthLabel = (date) =>
  date.toLocaleString("default", { month: "long", year: "numeric" });

export default function MonthlyChart() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  const fetchData = async (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const res = await API.get("/analytics/monthly", {
      params: { year, month }
    });

    setLabels(res.data.map((d) => d._id.slice(-2))); // day
    setData(res.data.map((d) => d.count));
  };

  useEffect(() => {
    fetchData(currentDate);
  }, [currentDate]);

  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  return (
    <div className="relative rounded-2xl p-6 bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl transition-transform duration-300 hover:-translate-y-1">

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-400/20 to-purple-500/20 blur-2xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Monthly Habit Completion
          </h2>
          <p className="text-sm text-gray-500">
            {getMonthLabel(currentDate)}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="px-3 py-1 rounded-md bg-white/40 hover:bg-white/60 text-sm"
          >
            ⬅️
          </button>
          <button
            onClick={nextMonth}
            className="px-3 py-1 rounded-md bg-white/40 hover:bg-white/60 text-sm"
          >
            ➡️
          </button>
        </div>
      </div>

      {/* Chart */}
      <Bar
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: "rgba(99,102,241,0.65)",
              hoverBackgroundColor: "rgba(99,102,241,0.85)",
              borderRadius: 8,
              barThickness: 18
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 },
              grid: { color: "rgba(0,0,0,0.05)" }
            }
          }
        }}
      />
    </div>
  );
}
