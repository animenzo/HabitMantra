import React, { useState } from "react";
import { formatDate } from "../../utils/dateHelpers";
import API from "../../services/api";
import {
  MdEdit,
  MdDeleteOutline,
  MdCheck,
  MdWarning,
  MdRefresh,
} from "react-icons/md";

const HabitRow = ({ habit, days, year, month, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [showDelete, setShowDelete] = useState(false);
  const [loadingDate, setLoadingDate] = useState(null);

  // Calculate Progress
  const completedCount = days.filter(
    (d) => habit.progress?.[formatDate(year, month, d)]
  ).length;
  const percentage = days.length > 0 ? Math.round((completedCount / days.length) * 100) : 0;

  // Toggle Habit with Loading State
  const toggle = async (date) => {
    setLoadingDate(date);
    try {
      await API.patch(`/habits/${habit._id}/toggle`, { date });
      refresh();
    } catch (error) {
      console.error("Failed to toggle habit", error);
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
    try {
      await API.put(`/habits/${habit._id}`, { name: name.trim() });
      setIsEditing(false);
      refresh();
    } catch (error) {
      console.error("Failed to update habit", error);
      setName(habit.name);
      setIsEditing(false);
    }
  };

  // Delete Habit
  const deleteHabit = async () => {
    try {
      await API.delete(`/habits/${habit._id}`);
      setShowDelete(false);
      refresh();
    } catch (error) {
      console.error("Failed to delete habit", error);
    }
  };

  return (
    <>
      <tr className="group hover:bg-slate-50/70 transition-colors">
        {/* Habit Name (Sticky Left, responsive width) */}
        <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50/95 px-2.5 sm:px-3 py-2 border-r border-slate-200/80 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)] w-36 min-w-36 sm:w-48 sm:min-w-48">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 h-9">
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
                className="w-full px-2 py-1 text-xs sm:text-sm border border-indigo-400 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-slate-900 bg-white"
              />
            ) : (
              <>
                <span
                  className="font-semibold text-slate-800 text-xs sm:text-sm truncate max-w-[85px] sm:max-w-[150px]"
                  title={habit.name}
                >
                  {habit.name}
                </span>

                {/* Actions (Always accessible on touch, subtle on desktop hover) */}
                <div className="flex items-center gap-0.5 sm:gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Edit habit name"
                  >
                    <MdEdit size={15} />
                  </button>
                  <button
                    onClick={() => setShowDelete(true)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete habit"
                  >
                    <MdDeleteOutline size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        </td>

        {/* Circular Checkboxes for Each Day */}
        {days.map((day) => {
          const date = formatDate(year, month, day);
          const isChecked = Boolean(habit.progress?.[date]);
          const isLoading = loadingDate === date;

          return (
            <td key={day} className="p-1 text-center min-w-8 sm:min-w-9">
              <button
                type="button"
                onClick={() => toggle(date)}
                disabled={isLoading}
                aria-label={`Toggle ${habit.name} for day ${day}`}
                className={`
                  w-7 h-7 sm:w-6 sm:h-6 rounded-lg mx-auto flex items-center justify-center transition-all duration-200
                  active:scale-90 touch-manipulation cursor-pointer
                  ${
                    isChecked
                      ? "bg-emerald-500 text-white shadow-xs ring-1 ring-emerald-600/20"
                      : "bg-slate-100/90 text-transparent hover:bg-indigo-50 hover:text-indigo-400 hover:border-indigo-200 border border-slate-200/60"
                  }
                `}
              >
                {isLoading ? (
                  <MdRefresh className="animate-spin text-slate-400" size={14} />
                ) : (
                  <MdCheck
                    size={16}
                    className={`transition-transform duration-200 ${
                      isChecked ? "scale-100" : "scale-0"
                    }`}
                  />
                )}
              </button>
            </td>
          );
        })}

        {/* Progress Column (Sticky ONLY on md+ screens to leave full mobile width open) */}
        <td className="md:sticky md:right-0 z-10 bg-white group-hover:bg-slate-50/95 px-2 py-2 border-l border-slate-200/80 md:shadow-[-2px_0_6px_-2px_rgba(0,0,0,0.06)] min-w-18 sm:min-w-20 text-center">
          <div className="flex items-center justify-center">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                percentage === 100
                  ? "bg-emerald-100 text-emerald-800"
                  : percentage >= 50
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {percentage}%
            </span>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-xl w-fit">
              <MdWarning size={22} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Habit?</h3>
              <p className="text-sm text-slate-600 mt-1 leading-normal">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">"{habit.name}"</span>?
                This will also remove historical records for this habit.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowDelete(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteHabit}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-xs cursor-pointer"
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
