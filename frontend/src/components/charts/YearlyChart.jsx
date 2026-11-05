import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import API from "../../services/api";
import { MdChevronLeft, MdChevronRight, MdBarChart } from "react-icons/md";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function YearlyChart() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [data, setData] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(false);

  const fetchData = async (y) => {
    try {
      setLoading(true);
      const res = await API.get("/analytics/yearly", {
        params: { year: y },
      });

      const counts = Array(12).fill(0);
      (res.data || []).forEach((item) => {
        const monthIndex = parseInt(item._id.split("-")[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          counts[monthIndex] = item.count;
        }
      });

      setData(counts);
    } catch (err) {
      console.error("Failed to fetch yearly data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(year);
  }, [year]);

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);

  const totalThisYear = data.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Annual Habit Trajectory
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {totalThisYear} completions in {year}
            </span>
          </div>
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MdBarChart size={12} /> Full year breakdown by month
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-50 border border-slate-200/80 rounded-xl p-1">
          <button
            onClick={prevYear}
            className="p-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
            title="Previous Year"
          >
            <MdChevronLeft size={18} />
          </button>
          <span className="px-2 text-xs font-bold text-slate-800">{year}</span>
          <button
            onClick={nextYear}
            disabled={year >= new Date().getFullYear()}
            className="p-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white disabled:opacity-30 transition-colors"
            title="Next Year"
          >
            <MdChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-56">
        <Bar
          data={{
            labels: months,
            datasets: [
              {
                data,
                backgroundColor: "rgba(79, 70, 229, 0.75)",
                hoverBackgroundColor: "rgba(67, 56, 202, 1)",
                borderRadius: 8,
                barPercentage: 0.6,
                categoryPercentage: 0.65,
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
                  stepSize: 5,
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
}
