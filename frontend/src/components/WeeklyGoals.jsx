import React from "react";
import { useState } from "react";
import API from "../services/api";
import { getWeekStart } from "../utils/weekHelpers";
import { useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";

const WeeklyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [title, setTitle] = useState("");

  const weekStart = getWeekStart();
  //loadgoals
  const load = async () => {
    const res = await API.get(`/weekly-goals?weekStart=${weekStart}`);
    setGoals(res.data);
  };
  const addGoal = async () => {
    if (!title.trim()) return;
    await API.post("/weekly-goals", { title, weekStart });
    setTitle("");
    load();
  };
  const toggle = async (id) => {
    await API.patch(`/weekly-goals/${id}/toggle`);
    load();
  };

  const remove = async () => {
    await API.delete(`/weekly-goals/${id}`);
    load;
  };

  const update = async (id) => {
    if (!editText.trim()) return;
    await API.patch(`/weekly-goals/${id}`, {
      title: editText.trim(),
    });

    setEditingId(null);
    setEditText("");
    load();
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="bg-white border border-zinc-700 rounded-lg p-4 mt-6 ">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        🔥 Weekly goals
      </h3>
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 bg-transparent border border-zinc-500 rounded px-3 py-1"
          type="text"
          placeholder="New Weekly goal.."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addGoal} className="bg-black px-4 text-white rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {goals.map((goal) => (
          <li
            key={goal._id}
            className="flex items-center justify-between hover:bg-zinc-100 px-2 py-1 rounded"
          >
            {editingId === goal._id ? (
              <input
                className="flex-1 bg-transparent border border-border rounded px-2 py-1 mr-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateGoal(goal._id);
                  if (e.key === "Escape") {
                    setEditingId(null);
                    setEditText("");
                  }
                }}
                autoFocus
              />
            ) : (
              <span
                className={goal.completed ? "line-through text-gray-500" : ""}
              >
                {goal.title}
              </span>
            )}
        <div className="flex gap-1 items-center">
                 <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggle(goal._id)}
              className="bg-cyan-400 cursor-pointer"
            />
            {editingId === goal._id ? (
              <button
                onClick={() => update(goal._id)}
                className="text-green-400 cursor-pointer text-sm"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingId(goal._id);
                  setEditText(goal.title);
                }}
                className="text-zinc-800 cursor-pointer text-md"
              >
                <CiEdit />
              </button>
            )}
            <button
              onClick={() => remove(goal._id)}
              className="text-red-500 cursor-pointer text-sm"
            >
              <FaTrashAlt />
            </button>
        </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeeklyGoals;
