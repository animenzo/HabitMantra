import React, { useState, useEffect } from "react";
import { getToday } from "../../utils/dateHelpers";
import API from "../../services/api";
import {
  MdCheck,
  MdAdd,
  MdEdit,
  MdDeleteOutline,
  MdClose,
  MdTrackChanges,
  MdCalendarToday,
} from "react-icons/md";

const DailyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  const today = getToday();

  // Load Goals
  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/daily-goals?date=${today}`);
      setGoals(res.data || []);
    } catch (error) {
      console.error("Failed to load daily goals", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Goal
  const addGoal = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await API.post("/daily-goals", {
        title: title.trim(),
        date: today,
      });
      setTitle("");
      load();
    } catch (error) {
      console.error("Failed to add daily goal", error);
    }
  };

  // Delete Goal
  const remove = async (id) => {
    try {
      await API.delete(`/daily-goals/${id}`);
      load();
    } catch (error) {
      console.error("Failed to delete daily goal", error);
    }
  };

  // Update Text
  const updateGoal = async (id) => {
    if (!editText.trim()) return;
    try {
      await API.patch(`/daily-goals/${id}`, { title: editText.trim() });
      setEditingId(null);
      setEditText("");
      load();
    } catch (error) {
      console.error("Failed to update daily goal", error);
    }
  };

  // Toggle Completion
  const toggle = async (id) => {
    try {
      await API.patch(`/daily-goals/${id}/toggle`);
      load();
    } catch (error) {
      console.error("Failed to toggle daily goal", error);
    }
  };

  useEffect(() => {
    load();
  }, [today]);

  const completedCount = goals.filter((g) => g.completed).length;
  const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <MdTrackChanges size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Daily Goals</h3>
              <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MdCalendarToday size={12} /> {todayLabel}
              </p>
            </div>
          </div>

          {goals.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                {completedCount}/{goals.length}
              </span>
              <span className="text-xs font-bold text-indigo-700 px-2 py-0.5 rounded-full bg-indigo-50">
                {progress}%
              </span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={addGoal} className="relative mb-3.5">
          <input
            className="w-full bg-slate-50 border border-slate-200/80 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 pr-10 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 placeholder:text-slate-400 font-medium transition-all"
            placeholder="Add a priority for today..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="submit"
            disabled={!title.trim()}
            aria-label="Add goal"
            className="absolute right-1.5 top-1.5 p-1.5 rounded-lg transition-all bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-xs"
          >
            <MdAdd size={18} />
          </button>
        </form>

        {/* Goal List */}
        <ul className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          {loading && goals.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-6">Loading goals...</p>
          )}

          {!loading && goals.length === 0 && (
            <div className="text-center py-7 px-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-slate-500 text-xs font-medium">No daily goals set for today.</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Focus on 1–3 high-impact items.</p>
            </div>
          )}

          {goals.map((goal) => (
            <li
              key={goal._id}
              className={`group flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                goal.completed
                  ? "bg-slate-50/70 border-slate-200/60"
                  : "bg-white border-slate-200/80 hover:border-slate-300"
              }`}
            >
              {/* Checkbox button */}
              <button
                onClick={() => toggle(goal._id)}
                aria-label={goal.completed ? "Mark incomplete" : "Mark complete"}
                className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  goal.completed
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white border-slate-300 text-transparent hover:border-indigo-400"
                }`}
              >
                <MdCheck size={14} className={goal.completed ? "opacity-100" : "opacity-0"} />
              </button>

              {/* Goal Title */}
              <div className="flex-1 min-w-0">
                {editingId === goal._id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateGoal(goal._id);
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditText("");
                        }
                      }}
                      className="w-full bg-white border border-indigo-400 rounded-lg px-2 py-0.5 text-xs text-slate-800 outline-none"
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <MdClose size={16} />
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => toggle(goal._id)}
                    className={`block truncate text-xs font-medium cursor-pointer select-none transition-colors ${
                      goal.completed ? "text-slate-400 line-through" : "text-slate-800"
                    }`}
                  >
                    {goal.title}
                  </span>
                )}
              </div>

              {/* Actions */}
              {editingId !== goal._id && (
                <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingId(goal._id);
                      setEditText(goal.title);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Edit goal"
                  >
                    <MdEdit size={14} />
                  </button>
                  <button
                    onClick={() => remove(goal._id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete goal"
                  >
                    <MdDeleteOutline size={14} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Progress Track */}
      {goals.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyGoals;
