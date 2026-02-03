import React, { useEffect, useState } from "react";
import API from "../services/api";
import { MdLightbulb, MdTrendingUp, MdWarningAmber, MdEvent } from "react-icons/md";

const styleMap = {
  weekday:  { icon: MdEvent,       style: "bg-blue-50 text-blue-700 border-blue-100" },
  month:    { icon: MdTrendingUp,  style: "bg-purple-50 text-purple-700 border-purple-100" },
  warning:  { icon: MdWarningAmber,style: "bg-amber-50 text-amber-700 border-amber-100" },
  positive: { icon: MdLightbulb,   style: "bg-emerald-50 text-emerald-700 border-emerald-100" },
};

export default function SmartInsights() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    API.get("/analytics/insights").then(res => setInsights(res.data.insights || []));
  }, []);

  if (!insights.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
      <h3 className="font-bold text-gray-800 flex items-center gap-2">
        <MdLightbulb className="text-yellow-500" /> Smart Insights
      </h3>

      <div className="space-y-3">
        {insights.map((item, idx) => {
          const { icon: Icon, style } = styleMap[item.type] || styleMap.weekday;
          return (
            <div key={idx} className={`flex gap-3 p-3 rounded-lg border ${style} text-sm`}>
              <Icon size={20} className="shrink-0 mt-0.5" />
              <p className="leading-tight">{item.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}