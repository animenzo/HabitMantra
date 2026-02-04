import React, { useState } from "react";
import { formatDate } from "../../utils/dateHelpers";
import API from "../../services/api";
import { 
  MdEdit, 
  MdDeleteOutline, 
  MdCheck, 
  MdClose, 
  MdWarning,
  MdRefresh 
} from "react-icons/md";

const HabitRow = ({ habit, days, year, month, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [showDelete, setShowDelete] = useState(false);
  const [loadingDate, setLoadingDate] = useState(null);

  // Calculate Progress
  const completedCount = days.filter((d) =>
    habit.progress?.[formatDate(year, month, d)]
  ).length;
  const percentage = Math.round((completedCount / days.length) * 100);

  // Toggle Habit with Loading State
  const toggle = async (date) => {
    setLoadingDate(date); 
    try {
      await API.patch(`/habits/${habit._id}/toggle`, { date });
      refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDate(null);
    }
  };

  // Update Habit Name
  const updateHabit = async () => {
    if (!name.trim() || name === habit.name) {
      setIsEditing(false);
      setName(habit.name);
      return;
    }
    await API.put(`/habits/${habit._id}`, { name });
    setIsEditing(false);
    refresh();
  };

  // Delete Habit
  const deleteHabit = async () => {
    await API.delete(`/habits/${habit._id}`);
    setShowDelete(false);
    refresh();
  };

  return (
    <>
      <tr className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
        
        {/* ================= HABIT NAME (Sticky Left) ================= */}
        <td className="sticky left-0 z-20  group-hover:bg-gray-50/50 px-1 py-1 border-r border-gray-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between  min-w-16 h-8">
            {isEditing ? (
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={updateHabit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateHabit();
                  if (e.key === "Escape") {
                    setName(habit.name);
                    setIsEditing(false);
                  }
                }}
                className="w-full px-2 py-1 text-sm border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            ) : (
              <>
                <span className="font-medium text-gray-700 truncate max-w-20" title={habit.name}>
                  {habit.name}
                </span>
                
                {/* Actions (Visible on Hover) */}
                <div className="flex items-center gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md bg-indigo-50 transition-colors"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <MdDeleteOutline size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </td>

        {/* ================= CIRCULAR CHECKBOXES ================= */}
        {days.map((day) => {
          const date = formatDate(year, month, day);
          const isChecked = habit.progress?.[date];
          const isLoading = loadingDate === date;

          return (
            <td key={day} className="p-1 text-center min-w-8">
              <button
                onClick={() => toggle(date)}
                disabled={isLoading}
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-out
                  active:scale-90
                  ${
                    isChecked
                      ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                      : "bg-gray-100 text-transparent hover:bg-gray-200"
                  }
                `}
              >
                {/* Loading Spinner or Check Icon */}
                {isLoading ? (
                  <MdRefresh className="animate-spin text-gray-400" size={16} />
                ) : (
                  <MdCheck 
                    size={18} 
                    className={`transition-transform duration-300 ${isChecked ? "scale-100" : "scale-0"}`} 
                  />
                )}
              </button>
            </td>
          );
        })}

        {/* ================= PROGRESS BAR ================= */}
       <td className="px-1 py-1 sticky bg-white group-hover:bg-gray-50/50 border-l border-gray-100 z-10">
  <div className="flex items-center justify-center">
    {/* Container for the circular bar */}
    <div className="relative w-8 h-8 flex items-center justify-center">
      
      {/* 1. Background Circle (The Track) */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-200"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        
        {/* 2. Progress Circle (The Indicator) */}
        <path
          className={`transition-all duration-500 ease-out ${
            percentage === 100 
              ? "text-emerald-500 drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" 
              : "text-indigo-500"
          }`}
          strokeDasharray="100, 100"
          strokeDashoffset={100 - percentage}
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* 3. Percentage Text (Centered) */}
      <span className="absolute text-[10px] font-bold text-gray-600">
        {percentage}%
      </span>
    </div>
  </div>
</td>
      </tr>

      {/* ================= DELETE MODAL ================= */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-xl w-fit">
              <MdWarning size={24} />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Habit?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-semibold text-gray-800">"{habit.name}"</span>? 
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteHabit}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all active:scale-95"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitRow;