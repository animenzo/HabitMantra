import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { MdLightbulb, MdTrendingUp, MdWarningAmber, MdEvent } from "react-icons/md";

const styleMap = {
  weekday: {
    icon: MdEvent,
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200/60",
    iconBg: "bg-blue-100 text-blue-700",
  },
  month: {
    icon: MdTrendingUp,
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200/60",
    iconBg: "bg-purple-100 text-purple-700",
  },
  warning: {
    icon: MdWarningAmber,
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200/60",
    iconBg: "bg-amber-100 text-amber-800",
  },
  positive: {
    icon: MdLightbulb,
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
    iconBg: "bg-emerald-100 text-emerald-800",
  },
};

export default function SmartInsights() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    API.get("/analytics/insights")
      .then((res) => setInsights(res.data.insights || []))
      .catch((err) => console.error("Failed to load insights", err));
  }, []);

  if (!insights.length) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
          <MdLightbulb size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Smart Insights</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated habit patterns and trends</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {insights.map((item, idx) => {
          const config = styleMap[item.type] || styleMap.weekday;
          const Icon = config.icon;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl border ${config.badgeBg} transition-all`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${config.iconBg}`}>
                <Icon size={16} />
              </div>
              <p className="text-xs font-semibold leading-relaxed text-slate-800">
                {item.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
