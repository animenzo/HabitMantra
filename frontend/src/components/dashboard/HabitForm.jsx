import React, { useState } from "react";
import API from "../../services/api";
import { MdAdd, MdRefresh } from "react-icons/md";

const HabitForm = ({ refresh }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await API.post("/habits", { name });
      setName("");
      refresh();
    } catch (error) {
      console.error("Failed to add habit", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={submitHandler}
      className="w-full max-w-lg mx-auto mb-2 animate-in slide-in-from-top-4 duration-300"
    >
      <div className={`
        flex flex-col sm:flex-row gap-3 p-2 rounded-xl transition-all duration-300 border
        ${focused 
          ? "bg-white shadow-lg border-indigo-100 ring-4 ring-indigo-50/50" 
          : "bg-gray-50 border-gray-200"
        }
      `}>
        
        {/* Input Wrapper */}
        <div className="relative flex-1">
          <input
            id="habit-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading}
            className="peer w-full h-8 px-3 pt-2  bg-transparent rounded-lg outline-none text-gray-800 placeholder-transparent"
            placeholder="New habit..."
          />
          <label
            htmlFor="habit-input"
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none text-gray-400
              peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-sm
              peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-indigo-500 peer-focus:font-bold
              ${name ? "top-1 text-[10px] text-indigo-500 font-bold" : ""}
            `}
          >
            What do you want to track?
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className={`
            h-8 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200
            ${!name.trim() 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 active:scale-95"
            }
          `}
        >
          {loading ? (
            <MdRefresh className="animate-spin text-lg" />
          ) : (
            <>
              <MdAdd className="text-xl" />
              <span>Add Habit</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default HabitForm;