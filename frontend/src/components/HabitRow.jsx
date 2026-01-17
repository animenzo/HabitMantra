import React, { useState } from "react";
import { formatDate } from "../utils/dateHelpers";
import API from "../services/api";

const HabitRow = ({ habit, days, year, month, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [showDelete, setShowDelete] = useState(false);

  const completed = days.filter(d =>
    habit.progress?.[formatDate(year, month, d)]
  ).length;

  const percentage = Math.round((completed / days.length) * 100);

  const toggle = async (date) => {
    await API.patch(`/habits/${habit._id}/toggle`, { date });
    refresh();
  };

  // ✅ update habit
  const updateHabit = async () => {
    if (!name.trim()) return;

    await API.put(`/habits/${habit._id}`, { name });
    setIsEditing(false);
    refresh();
  };

  // ✅ delete habit
  const deleteHabit = async () => {
    await API.delete(`/habits/${habit._id}`);
    setShowDelete(false);
    refresh();
  };

  return (
    <>
      <tr className="border-t hover:bg-[#eeeeee]">
        {/* Habit Name */}
        <td className="sticky left-0 bg-white z-10 px-3 py-2 font-medium flex items-center gap-2">
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
              className="border px-2 py-1 rounded w-full"
            />
          ) : (
            <>
              <span>{habit.name}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-black"
              >
                ✏️
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="text-red-400 hover:text-red-600"
              >
                🗑️
              </button>
            </>
          )}
        </td>

        {/* Days */}
        {days.map((day) => {
          const date = formatDate(year, month, day);
          const checked = habit.progress?.[date];

          return (
            <td key={day} className="px-2 py-2 text-center">
              <input
                type="checkbox"
                checked={checked || false}
                onChange={() => toggle(date)}
                className="w-4 h-4 cursor-pointer"
              />
            </td>
          );
        })}

        {/* Percentage */}
        <td className="px-3 py-2 text-gray-400">{percentage}%</td>
      </tr>

      {/* 🗑️ Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded w-80">
            <h3 className="font-semibold mb-3">
              Delete "{habit.name}"?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteHabit}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitRow;
