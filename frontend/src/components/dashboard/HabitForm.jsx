import React, { useState } from "react";
import API from "../../services/api";
import { MdAdd, MdRefresh } from "react-icons/md";

const HabitForm = ({ refresh }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await API.post("/habits", { name: name.trim() });
      setName("");
      refresh();
    } catch (error) {
      console.error("Failed to add habit", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="w-full sm:w-auto">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl p-1.5 focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <input
          id="habit-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full sm:w-64 px-2.5 py-1 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium"
          placeholder="Add new habit (e.g. Read 20 mins)..."
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="shrink-0 h-8 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-xs"
        >
          {loading ? (
            <MdRefresh className="animate-spin text-sm" />
          ) : (
            <>
              <MdAdd size={16} />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default HabitForm;
