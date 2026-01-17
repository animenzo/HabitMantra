import { useEffect, useState } from "react";
import API from "../../services/api";
import MonthPicker from "./MonthPicker";
import MonthCompareCard from "./MonthCompareCard";

export default function MonthComparison() {
  const now = new Date();

  const [left, setLeft] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1
  });

  const [right, setRight] = useState({
    year: now.getFullYear(),
    month: now.getMonth()
  });

  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);

  useEffect(() => {
    API.get(`/analytics/comparemonthly?year=${left.year}&month=${left.month}`)
      .then(res => setLeftData(res.data));

    API.get(`/analytics/comparemonthly?year=${right.year}&month=${right.month}`)
      .then(res => setRightData(res.data));
  }, [left, right]);

  return (
    <div className="space-y-6 px-2 sm:px-4 ">
      
      {/* Pickers */}
      <div className="
        flex flex-col sm:flex-row
        items-center justify-center
        gap-4 sm:gap-6
      ">
        <MonthPicker value={left} onChange={setLeft} />

        <span className="font-semibold text-sm sm:text-base">
          VS
        </span>

        <MonthPicker value={right} onChange={setRight} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leftData && (
          <MonthCompareCard
            title="Month A"
            data={leftData}
          />
        )}
        {rightData && (
          <MonthCompareCard
            title="Month B"
            data={rightData}
          />
        )}
      </div>
    </div>
  );
}
