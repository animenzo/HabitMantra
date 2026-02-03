import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  MdLocalFireDepartment, 
  MdEmojiEvents, 
  MdInsights, 
  MdTrendingUp 
} from "react-icons/md";

export default function HabitAnalytics() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics/habits")
      .then((res) => setHabits(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Helper: Color coding based on success rate
  const getTheme = (rate) => {
    if (rate >= 80) return { 
      text: "text-emerald-600", 
      bg: "bg-emerald-500", 
      light: "bg-emerald-50 text-emerald-700", 
      border: "border-emerald-100" 
    };
    if (rate >= 50) return { 
      text: "text-indigo-600", 
      bg: "bg-indigo-500", 
      light: "bg-indigo-50 text-indigo-700", 
      border: "border-indigo-100" 
    };
    return { 
      text: "text-orange-600", 
      bg: "bg-orange-500", 
      light: "bg-orange-50 text-orange-700", 
      border: "border-orange-100" 
    };
  };

  if (loading) return <div className="text-center py-8 text-gray-400 text-sm">Loading stats...</div>;

  return (
    <div className="mt-8 space-y-4">
      {/* Section Header */}
      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
        <MdInsights className="text-indigo-600" /> Performance
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((h) => {
          const theme = getTheme(h.completionRate);

          return (
            <div
              key={h.id}
              className={`bg-white border ${theme.border} rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              {/* Header: Name & Badge */}
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 truncate pr-2" title={h.name}>
                  {h.name}
                </h4>
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${theme.light}`}>
                  {h.completionRate}%
                </span>
              </div>

            

              {/* Stats Mini-Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Current Streak */}
                <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center group">
                  <MdLocalFireDepartment 
                    className={`text-xl mb-1 transition-transform group-hover:scale-110 ${h.streak > 0 ? "text-orange-500 animate-pulse" : "text-gray-300"}`} 
                  />
                  <span className="text-sm font-bold text-gray-700">{h.streak}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Streak</span>
                </div>

                {/* Best Streak */}
                <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center group">
                  <MdEmojiEvents className="text-xl mb-1 text-yellow-500 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-bold text-gray-700">{h.bestStreak}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Best</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}