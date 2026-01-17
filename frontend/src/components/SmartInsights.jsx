import { useEffect, useState } from "react";
import API from "../services/api";

const iconMap = {
  weekday: "📅",
  month: "📈",
  warning: "⚠️",
  positive: "🏆"
};

export default function SmartInsights() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    API.get("/analytics/insights")
      .then(res => setInsights(res.data.insights));
  }, []);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <h3 className="font-semibold">Smart Insights</h3>

      {insights.map((i, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
        >
          <span className="text-xl">{iconMap[i.type]}</span>
          <p className="text-sm text-gray-700">{i.message}</p>
        </div>
      ))}
    </div>
  );
}
