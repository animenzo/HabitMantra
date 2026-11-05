import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { registerSW } from "../../registerSW";
import {
  MdNotifications,
  MdAdd,
  MdClose,
  MdCheck,
  MdPlayArrow,
  MdPause,
  MdDeleteOutline,
  MdCalendarToday,
  MdAccessTime,
  MdLocalFireDepartment,
} from "react-icons/md";

const Reminder = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [repeatOption, setRepeatOption] = useState("0");
  const [customInterval, setCustomInterval] = useState("");

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/reminders");
      setReminders(res.data || []);
    } catch (error) {
      console.error("Failed to fetch reminders", error);
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    if (!title.trim() || !time) return;

    let finalInterval = 0;
    if (repeatOption === "custom") {
      finalInterval = Number(customInterval);
    } else {
      finalInterval = Number(repeatOption);
    }

    try {
      await API.post("/reminders", {
        title: title.trim(),
        nextTriggerAt: new Date(time),
        repeatType: finalInterval > 0 ? "custom" : "once",
        intervalMinutes: finalInterval,
      });

      setTitle("");
      setTime("");
      setRepeatOption("0");
      setCustomInterval("");
      setIsFormOpen(false);
      fetchReminders();
    } catch (error) {
      console.error("Error adding reminder", error);
    }
  };

  const toggleReminder = async (id) => {
    try {
      await API.patch(`/reminders/toggle/${id}`);
      fetchReminders();
    } catch (error) {
      console.error("Failed to toggle reminder", error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await API.delete(`/reminders/${id}`);
      fetchReminders();
    } catch (error) {
      console.error("Failed to delete reminder", error);
    }
  };

  const completeReminder = async (id) => {
    try {
      await API.patch(`/reminders/complete/${id}`);
      fetchReminders();
    } catch (error) {
      console.error("Failed to complete reminder", error);
    }
  };

  useEffect(() => {
    registerSW();
    fetchReminders();
  }, []);

  const formatTimeDisplay = (dateString, interval) => {
    const date = new Date(dateString);
    if (interval > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-indigo-100">
          <MdAccessTime size={13} /> Every {interval}m
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-medium">
        <MdCalendarToday size={12} />
        {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at{" "}
        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <MdNotifications size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Reminders</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {reminders.filter((r) => r.isActive).length} active alerts
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          aria-label={isFormOpen ? "Close reminder form" : "Add new reminder"}
          className={`p-2 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1 ${
            isFormOpen
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
          }`}
        >
          {isFormOpen ? <MdClose size={16} /> : <MdAdd size={16} />}
          <span className="hidden sm:inline">{isFormOpen ? "Cancel" : "New"}</span>
        </button>
      </div>

      {/* Collapsible Add Form */}
      {isFormOpen && (
        <form
          onSubmit={addReminder}
          className="mb-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3"
        >
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Reminder title (e.g. Drink Water, Evening Journal)..."
            className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-slate-800 placeholder:text-slate-400"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Trigger Time
              </label>
              <input
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-slate-700 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Recurrence
              </label>
              <div className="flex gap-1.5">
                <select
                  value={repeatOption}
                  onChange={(e) => setRepeatOption(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-slate-700 font-medium"
                >
                  <option value="0">Once (No repeat)</option>
                  <option value="1">Every 1 minute</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60">Every 1 hour</option>
                  <option value="1440">Daily</option>
                  <option value="custom">Custom minutes</option>
                </select>

                {repeatOption === "custom" && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Mins"
                    value={customInterval}
                    onChange={(e) => setCustomInterval(e.target.value)}
                    className="w-18 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-slate-700 font-medium"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!title.trim() || !time}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg disabled:bg-slate-200 disabled:text-slate-400 transition-colors shadow-xs"
            >
              Set Reminder
            </button>
          </div>
        </form>
      )}

      {/* Reminder List */}
      <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
        {loading && reminders.length === 0 && (
          <p className="text-center text-slate-400 py-6 text-xs font-medium">Syncing alerts...</p>
        )}

        {!loading && reminders.length === 0 && (
          <div className="text-center py-7 px-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-slate-500 text-xs font-medium">No reminders scheduled.</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Stay on track by adding routine prompts.</p>
          </div>
        )}

        {reminders.map((r) => (
          <div
            key={r._id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              r.isActive
                ? "bg-white border-slate-200/80 hover:border-indigo-200 shadow-xs"
                : "bg-slate-50/70 border-slate-200/50 opacity-60"
            }`}
          >
            {/* Info */}
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`font-semibold text-xs truncate ${
                    !r.isActive ? "text-slate-400 line-through" : "text-slate-850"
                  }`}
                >
                  {r.title}
                </span>
                {r.streak > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200/60">
                    <MdLocalFireDepartment size={12} className="text-amber-600" /> {r.streak}
                  </span>
                )}
              </div>
              <div>{formatTimeDisplay(r.nextTriggerAt, r.intervalMinutes)}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => completeReminder(r._id)}
                title="Mark reminder as completed"
                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <MdCheck size={16} />
              </button>

              <button
                onClick={() => toggleReminder(r._id)}
                title={r.isActive ? "Pause reminder" : "Resume reminder"}
                className={`p-1.5 rounded-lg transition-colors ${
                  r.isActive
                    ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                    : "text-amber-600 bg-amber-50 hover:bg-amber-100"
                }`}
              >
                {r.isActive ? <MdPause size={16} /> : <MdPlayArrow size={16} />}
              </button>

              <button
                onClick={() => deleteReminder(r._id)}
                title="Delete reminder"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <MdDeleteOutline size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminder;
