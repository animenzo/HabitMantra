import { useEffect, useState } from "react";
import API from "../../services/api";

export default function HabitAnalytics() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    API.get("/analytics/habits").then(res => setHabits(res.data));
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      {habits.map(h => (
        <div
          key={h.id}
          className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4"
        >
          <h4 className="font-semibold mb-2">{h.name}</h4>

          <div className="text-sm text-gray-600">
            Completion: <b>{h.completionRate}%</b>
          </div>
          <div className="text-sm">🔥 Current Streak: {h.streak}</div>
          <div className="text-sm">🏆 Best Streak: {h.bestStreak}</div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded mt-2">
            <div
              className="h-2 bg-indigo-500 rounded"
              style={{ width: `${h.completionRate}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
