import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import API from "../../services/api";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function YearlyChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(Array(12).fill(0));

  const fetchData = async (y) => {
    const res = await API.get("/analytics/yearly", {
      params: { year: y }
    });

    const counts = Array(12).fill(0);

    res.data.forEach((item) => {
      const monthIndex = parseInt(item._id.split("-")[1], 10) - 1;
      counts[monthIndex] = item.count;
    });

    setData(counts);
  };

  useEffect(() => {
    fetchData(year);
  }, [year]);

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);

  return (
    <div className="relative rounded-2xl p-6 bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl transition-transform duration-300 hover:-translate-y-1">

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-400/20 to-purple-500/20 blur-2xl -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Yearly Habit Completion
          </h2>
          <p className="text-sm text-gray-500">
            {year}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevYear}
            className="px-3 py-1 rounded-md bg-white/40 hover:bg-white/60 text-sm"
          >
            ⬅️
          </button>
          <button
            onClick={nextYear}
            className="px-3 py-1 rounded-md bg-white/40 hover:bg-white/60 text-sm"
          >
            ➡️
          </button>
        </div>
      </div>

      {/* Chart */}
      <Bar
        data={{
          labels: months,
          datasets: [
            {
              data,
              backgroundColor: "rgba(79,70,229,0.65)",
              hoverBackgroundColor: "rgba(79,70,229,0.85)",
              borderRadius: 8,
              barThickness: 22
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
