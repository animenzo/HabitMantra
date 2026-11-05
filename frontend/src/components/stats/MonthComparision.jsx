import { useEffect, useState } from "react";
import API from "../../services/api";
import MonthPicker from "./MonthPicker";
import MonthCompareCard from "./MonthCompareCard";
import { MdCompareArrows, MdTrendingUp, MdTrendingDown } from "react-icons/md";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function MonthComparison() {
  const now = new Date();

  const [left, setLeft] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const [right, setRight] = useState({
    year: now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear(),
    month: now.getMonth() === 0 ? 12 : now.getMonth(),
  });

  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);

  useEffect(() => {
    API.get(`/analytics/comparemonthly?year=${left.year}&month=${left.month}`)
      .then((res) => setLeftData(res.data))
      .catch((err) => console.error("Failed to load left month", err));

    API.get(`/analytics/comparemonthly?year=${right.year}&month=${right.month}`)
      .then((res) => setRightData(res.data))
      .catch((err) => console.error("Failed to load right month", err));
  }, [left, right]);

  const leftLabel = `${monthNames[left.month - 1]} ${left.year}`;
  const rightLabel = `${monthNames[right.month - 1]} ${right.year}`;

  const delta =
    leftData && rightData ? leftData.completionRate - rightData.completionRate : null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
            <MdCompareArrows size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Head-to-Head Month Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare habit completion volume and consistency between any two months
            </p>
          </div>
        </div>

        {/* Delta Chip */}
        {delta !== null && (
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {delta > 0 ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                <MdTrendingUp size={14} /> +{delta}% higher in {leftLabel}
              </span>
            ) : delta < 0 ? (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70">
                <MdTrendingDown size={14} /> {Math.abs(delta)}% higher in {rightLabel}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                Equal completion rate (0% delta)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Month A:</span>
          <MonthPicker value={left} onChange={setLeft} />
        </div>

        <span className="text-xs font-extrabold text-indigo-600 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100">
          VS
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Month B:</span>
          <MonthPicker value={right} onChange={setRight} />
        </div>
      </div>

      {/* Cards Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <MonthCompareCard title="Month A" data={leftData} monthLabel={leftLabel} />
        <MonthCompareCard title="Month B" data={rightData} monthLabel={rightLabel} />
      </div>
    </div>
  );
}
