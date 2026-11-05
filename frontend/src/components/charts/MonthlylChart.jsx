import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import API from "../../services/api";
import { MdChevronLeft, MdChevronRight, MdCalendarMonth } from "react-icons/md";

const getMonthLabel = (date) =>
  date.toLocaleString("en-US", { month: "long", year: "numeric" });

export default function MonthlyChart() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (date) => {
    try {
      setLoading(true);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");

      const res = await API.get("/analytics/monthly", {
        params: { year, month },
      });

      const items = res.data || [];
      setLabels(items.map((d) => d._id.slice(-2)));
      setData(items.map((d) => d.count));
    } catch (err) {
      console.error("Failed to fetch monthly data", err);
    } finally {
      setLoading(false);
    }
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

  const totalThisMonth = data.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Monthly Habit Distribution
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
              {totalThisMonth} total
            </span>
          </div>
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MdCalendarMonth size={12} /> {getMonthLabel(currentDate)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-50 border border-slate-200/80 rounded-xl p-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
            title="Previous Month"
          >
            <MdChevronLeft size={18} />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-colors"
            title="Next Month"
          >
            <MdChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-52">
        <Bar
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: "rgba(147, 51, 234, 0.75)",
                hoverBackgroundColor: "rgba(126, 34, 206, 1)",
                borderRadius: 6,
                barPercentage: 0.65,
                categoryPercentage: 0.7,
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
                  font: { size: 10 },
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
}
