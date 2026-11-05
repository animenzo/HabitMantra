import React from "react";
import WeeklyChart from "./charts/WeeklyChart";
import MonthlyChart from "./charts/MonthlylChart";
import YearlyChart from "./charts/YearlyChart";

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* 2-Column Row for Weekly and Monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <WeeklyChart />
        <MonthlyChart />
      </div>

      {/* Full-width Annual Trajectory */}
      <YearlyChart />
    </div>
  );
}
