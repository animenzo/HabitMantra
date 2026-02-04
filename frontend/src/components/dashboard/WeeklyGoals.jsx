import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { getWeekStart } from "../../utils/weekHelpers";
import { 
  MdCheck, 
  MdAdd, 
  MdEdit, 
  MdDeleteOutline, 
  MdClose, 
  MdLocalFireDepartment,
  MdDateRange
} from "react-icons/md";

const WeeklyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const weekStart = getWeekStart();

  // Load Goals
  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/weekly-goals?weekStart=${weekStart}`);
      setGoals(res.data);
    } catch (error) {
      console.error("Failed to load weekly goals", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Goal
  const addGoal = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    await API.post("/weekly-goals", { title, weekStart });
    setTitle("");
    load();
  };

  // Toggle Completion
  const toggle = async (id) => {
    await API.patch(`/weekly-goals/${id}/toggle`);
    load();
  };

  // Delete Goal
  const remove = async (id) => {
    await API.delete(`/weekly-goals/${id}`);
    load();
  };

  // Update Goal Text
  const update = async (id) => {
    if (!editText.trim()) return;
    await API.patch(`/weekly-goals/${id}`, { title: editText.trim() });
    setEditingId(null);
    setEditText("");
    load();
  };

  useEffect(() => {
    load();
  }, [weekStart]);

  // --- Calculations ---
  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  // Format Week Range Display
  const startDate = new Date(weekStart);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const dateRangeLabel = `${startDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}`;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm mt-3">
      
      {/* ================= HEADER ================= */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <MdLocalFireDepartment className="text-orange-500" /> 
            Weekly Focus
          </h3>
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MdDateRange size={14} /> {dateRangeLabel}
          </p>
        </div>
        
        {/* Progress Circle (Mini) */}
        {goals.length > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-orange-500">{progress}%</span>
            <span className="text-xs text-gray-400 font-medium">Done</span>
          </div>
        )}
      </div>

      {/* ================= INPUT FORM ================= */}
      <form onSubmit={addGoal} className="relative mb-6 group">
        <input
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 pr-12 outline-none focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
          placeholder="What must happen this week?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className={`
            absolute right-2 top-2 p-1.5 rounded-lg transition-all
            ${title.trim() 
              ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <MdAdd size={20} />
        </button>
      </form>

      {/* ================= LIST ================= */}
      <ul className="space-y-3 overflow-y-scroll max-h-30">
        {loading && goals.length === 0 && (
           <p className="text-center text-gray-400 text-sm py-4">Loading goals...</p>
        )}

        {!loading && goals.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-400 text-sm">No goals for this week yet.</p>
          </div>
        )}

        {goals.map((goal) => (
          <li
            key={goal._id}
            className={`
              group flex items-center gap-2 p-2 rounded-xl border transition-all duration-200
              ${goal.completed 
                ? "bg-orange-50/30 border-orange-100" 
                : "bg-white border-transparent hover:border-gray-200 hover:shadow-sm hover:bg-gray-50/50"
              }
            `}
          >
            {/* CHECKBOX (Glowing Circle) */}
            <button
              onClick={() => toggle(goal._id)}
              className={`
                shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300
                ${goal.completed
                  ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)] scale-110"
                  : "bg-white border-gray-300 text-transparent hover:border-orange-400"
                }
              `}
            >
              <MdCheck size={14} />
            </button>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              {editingId === goal._id ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") update(goal._id);
                      if (e.key === "Escape") {
                        setEditingId(null);
                        setEditText("");
                      }
                    }}
                    className="w-full bg-white border border-orange-300 rounded px-2 py-1 text-sm outline-none shadow-sm"
                  />
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                    <MdClose />
                  </button>
                </div>
              ) : (
                <span 
                  onClick={() => toggle(goal._id)}
                  className={`block truncate text-sm cursor-pointer transition-all ${
                    goal.completed ? "text-gray-400 line-through" : "text-gray-700"
                  }`}
                >
                  {goal.title}
                </span>
              )}
            </div>

            {/* ACTIONS (Hover Only) */}
            {editingId !== goal._id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => {
                    setEditingId(goal._id);
                    setEditText(goal.title);
                  }}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <MdEdit size={16} />
                </button>
                <button
                  onClick={() => remove(goal._id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <MdDeleteOutline size={16} />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Progress Bar (Bottom) */}
      {goals.length > 0 && (
        <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default WeeklyGoals;