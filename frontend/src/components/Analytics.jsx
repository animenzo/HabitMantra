import { useEffect, useState } from "react";
import API from "../services/api";
import WeeklyChart from "./charts/WeeklyChart";
import YearlyChart from "./charts/YearlyChart";
import { getWeekStart } from "../utils/weekHelpers";
import GlassCard from "./charts/GlassCard";
import HabitAnalytics from "./charts/HabitAnalytics";
import MonthlyChart from "./charts/MonthlylChart";

export default function Analytics() {
  const [weekly, setWeekly] = useState(Array(7).fill(0));
  const [yearly, setYearly] = useState(Array(12).fill(0));

  const [monthlyData, setMonthlyData] = useState([]);
const [monthlyLabels, setMonthlyLabels] = useState([])

  useEffect(() => {
    const load = async () => {
      const weekStart = getWeekStart();

      const w = await API.get(`/analytics/weekly?weekStart=${weekStart}`);
      const y = await API.get(`/analytics/yearly?year=2025`);

      // Map backend data
      w.data.forEach(d => {
        const day = new Date(d._id).getDay();
        weekly[day === 0 ? 6 : day - 1] = d.count;
      });

      y.data.forEach(d => {
        const month = Number(d._id.split("-")[1]) - 1;
        yearly[month] = d.count;
      });

      const loadMonthly = async () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");

  const res = await API.get(
    `/analytics/monthly?year=${year}&month=${month}`
  );

  const daysInMonth = new Date(year, Number(month), 0).getDate();
  const counts = Array(daysInMonth).fill(0);

  res.data.forEach(d => {
    const day = Number(d._id.split("-")[2]) - 1;
    counts[day] = d.count;
  });

  setMonthlyLabels(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  setMonthlyData(counts);
};

      setWeekly([...weekly]);
      setYearly([...yearly]);
    };

    load();
  }, []);

  return (
     <div className="mt-6 px-2 sm:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly */}
        <GlassCard title="Weekly Growth">
          <WeeklyChart data={weekly} />
        </GlassCard>

        {/* Monthly */}
        <GlassCard title="Monthly Progress">
          <MonthlyChart labels={monthlyLabels} data={monthlyData} />
        </GlassCard>

        {/* Yearly - full width on desktop */}
        <div className="lg:col-span-2">
          <GlassCard title="Yearly Growth">
            <YearlyChart data={yearly} />
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
