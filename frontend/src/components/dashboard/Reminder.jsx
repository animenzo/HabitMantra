import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { registerSW } from "../../registerSW";

const Reminder = () => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [interval, setInterval] = useState(0);

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH
  ========================= */
  const fetchReminders = async () => {
    setLoading(true);
    const res = await API.get("/reminders");
    setReminders(res.data);
    setLoading(false);
  };

  /* =========================
     ADD
  ========================= */
  const addReminder = async () => {
    if (!title || !time) return;

    await API.post("/reminders", {
      title,
      nextTriggerAt: new Date(time),
      repeatType: interval > 0 ? "custom" : "once",
      intervalMinutes: Number(interval)
    });

    setTitle("");
    setTime("");
    setInterval(0);

    fetchReminders();
  };

  /* =========================
     TOGGLE
  ========================= */
  const toggleReminder = async (id) => {
    await API.patch(`/reminders/toggle/${id}`);
    fetchReminders();
  };

  /* =========================
     DELETE
  ========================= */
  const deleteReminder = async (id) => {
    await API.delete(`/reminders/${id}`);
    fetchReminders();
  };

  /* =========================
     COMPLETE
  ========================= */
  const completeReminder = async (id) => {
    await API.patch(`/reminders/complete/${id}`);
    fetchReminders();
  };

  useEffect(() => {
    registerSW();
    fetchReminders();
  }, []);

  /* =========================
     UI
  ========================= */

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <h1 className="text-3xl font-bold">🔔 Reminders</h1>

      {/* ================= ADD CARD ================= */}
      <div className="bg-zinc-100 shadow-xl rounded-2xl p-6 space-y-4">

        <h2 className="text-lg font-semibold">Add Reminder</h2>

        <input
          value={title}
          placeholder="Drink water / Study / Workout..."
          className="border rounded-lg p-3 w-full"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          value={time}
          className="border rounded-lg p-3 w-full"
          onChange={(e) => setTime(e.target.value)}
        />

        <div className="flex gap-3 justify-center items-center">
            <h3 className="text-xl">Repeat Times Every : </h3>
          <input
            type="number"
            placeholder="Interval"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="border rounded-lg p-3 flex-1"
          />
          <span className="flex items-center text-sm text-gray-500">
            minutes
          </span>
        </div>

        <button
          onClick={addReminder}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl font-semibold transition"
        >
          Add Reminder
        </button>
      </div>


      {/* ================= LIST ================= */}
      <div className="space-y-4">

        {loading && <p>Loading...</p>}

        {!loading && reminders.length === 0 && (
          <p className="text-gray-500 text-center">No reminders yet 😴</p>
        )}

        {reminders.map((r) => (
          <div
            key={r._id}
            className={`p-5 rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4
            ${r.isActive ? "bg-white dark:bg-zinc-900" : "bg-gray-100 opacity-60"}
            `}
          >
            {/* Info */}
            <div>
              <h3 className="font-semibold text-lg">{r.title}</h3>

              <p className="text-sm text-gray-500">
                {r.intervalMinutes > 0
                  ? `Every ${r.intervalMinutes} mins`
                  : new Date(r.nextTriggerAt).toLocaleString()}
              </p>

              {r.streak > 0 && (
                <p className="text-xs text-green-600">
                  🔥 Streak: {r.streak}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">

              <button
                onClick={() => completeReminder(r._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
              >
                Done
              </button>

              <button
                onClick={() => toggleReminder(r._id)}
                className={`px-3 py-1 rounded-lg text-white
                ${r.isActive ? "bg-red-500" : "bg-yellow-500"}
                `}
              >
                {r.isActive ? "Stop" : "Start"}
              </button>

              <button
                onClick={() => deleteReminder(r._id)}
                className="bg-gray-700 hover:bg-black text-white px-3 py-1 rounded-lg"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminder;
