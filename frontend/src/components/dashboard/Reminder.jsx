import React, { useEffect, useState } from "react";
import API from "../../services/api"; // Ensure path is correct
import { registerSW } from "../../registerSW";

// Import icons from react-icons/md (Material Design)
import { 
  MdNotifications, 
  MdAdd, 
  MdClose, 
  MdCheck, 
  MdPlayArrow, 
  MdPause, 
  MdDelete, 
  MdCalendarToday, 
  MdAccessTime,
  MdLocalFireDepartment 
} from "react-icons/md";

const Reminder = () => {
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [reminders, setReminders] = useState([]);
  
  // Form State
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [repeatOption, setRepeatOption] = useState("0"); // "0" = None/Once
  const [customInterval, setCustomInterval] = useState("");

  /* =========================
     FETCH
  ========================= */
  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/reminders");
      setReminders(res.data);
    } catch (error) {
      console.error("Failed to fetch reminders", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ADD
  ========================= */
  const addReminder = async (e) => {
    e.preventDefault();
    if (!title || !time) return;

    // Calculate final interval
    let finalInterval = 0;
    if (repeatOption === "custom") {
      finalInterval = Number(customInterval);
    } else {
      finalInterval = Number(repeatOption);
    }

    try {
      await API.post("/reminders", {
        title,
        nextTriggerAt: new Date(time),
        repeatType: finalInterval > 0 ? "custom" : "once",
        intervalMinutes: finalInterval,
      });

      // Reset Form
      setTitle("");
      setTime("");
      setRepeatOption("0");
      setCustomInterval("");
      setIsFormOpen(false); // Close form to save space
      fetchReminders();
    } catch (error) {
      console.error("Error adding reminder", error);
    }
  };

  /* =========================
     ACTIONS
  ========================= */
  const toggleReminder = async (id) => {
    await API.patch(`/reminders/toggle/${id}`);
    fetchReminders();
  };

  const deleteReminder = async (id) => {
    await API.delete(`/reminders/${id}`);
    fetchReminders();
  };

  const completeReminder = async (id) => {
    await API.patch(`/reminders/complete/${id}`);
    fetchReminders();
  };

  useEffect(() => {
    registerSW();
    fetchReminders();
  }, []);

  /* =========================
     HELPERS
  ========================= */
  const formatTimeDisplay = (dateString, interval) => {
    const date = new Date(dateString);
    if (interval > 0) {
      return (
        <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">
          <MdAccessTime size={14} /> Every {interval}m
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-gray-500 text-xs">
        <MdCalendarToday size={14} /> 
        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    );
  };

  return (
    <div className="max-w-xl mx-auto w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden font-sans">
      {/* ================= HEADER ================= */}
      <div className="p-4 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <MdNotifications className="text-indigo-500" size={22} />
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Reminders</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`p-2 rounded-full transition-colors ${
            isFormOpen 
              ? "bg-red-100 text-red-600 hover:bg-red-200" 
              : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
          }`}
        >
          {isFormOpen ? <MdClose size={20} /> : <MdAdd size={20} />}
        </button>
      </div>

      {/* ================= ADD FORM (Collapsible) ================= */}
      {isFormOpen && (
        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={addReminder} className="flex flex-col gap-3">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-gray-600"
              />

              <div className="flex gap-2">
                <select
                  value={repeatOption}
                  onChange={(e) => setRepeatOption(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                >
                  <option value="0">Don't Repeat</option>
                  <option value="1">Every 1m</option>
                  <option value="30">Every 30m</option>
                  <option value="60">Every 1h</option>
                  <option value="1440">Daily</option>
                  <option value="custom">Custom</option>
                </select>

                {repeatOption === "custom" && (
                  <input
                    type="number"
                    placeholder="Min"
                    value={customInterval}
                    onChange={(e) => setCustomInterval(e.target.value)}
                    className="w-20 px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-zinc-800 dark:border-zinc-700"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors shadow-sm"
            >
              Set Reminder
            </button>
          </form>
        </div>
      )}

      {/* ================= LIST ================= */}
      <div className="max-h-100 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {loading && <p className="text-center text-gray-400 py-4 text-sm">Syncing...</p>}

        {!loading && reminders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">😴</p>
            <p className="text-gray-500 text-sm">No active reminders</p>
          </div>
        )}

        {reminders.map((r) => (
          <div
            key={r._id}
            className={`
              group flex items-center justify-between p-3 rounded-xl border transition-all duration-200
              ${r.isActive 
                ? "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-indigo-200 shadow-sm" 
                : "bg-gray-50 dark:bg-zinc-950 border-transparent opacity-75 grayscale-50"
              }
            `}
          >
            {/* Left: Info */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold text-sm truncate ${!r.isActive && 'text-gray-500 line-through'}`}>
                  {r.title}
                </h3>
                {r.streak > 0 && (
                  <span className="flex items-center text-[10px] font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded-full">
                    <MdLocalFireDepartment size={12} /> {r.streak}
                  </span>
                )}
              </div>
              <div className="flex items-center">
                {formatTimeDisplay(r.nextTriggerAt, r.intervalMinutes)}
              </div>
            </div>

            {/* Right: Actions (Icons) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => completeReminder(r._id)}
                title="Mark Done"
                className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <MdCheck size={20} />
              </button>

              <button
                onClick={() => toggleReminder(r._id)}
                title={r.isActive ? "Pause" : "Resume"}
                className={`p-2 rounded-lg transition-colors ${
                  r.isActive 
                    ? "text-gray-400 hover:text-amber-500 hover:bg-amber-50" 
                    : "text-amber-500 bg-amber-50 hover:bg-amber-100"
                }`}
              >
                {r.isActive ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
              </button>

              <button
                onClick={() => deleteReminder(r._id)}
                title="Delete"
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminder;