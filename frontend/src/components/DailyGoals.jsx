import React from 'react'
import { getToday } from '../utils/dateHelpers'
import { useState } from 'react'
import API from '../services/api'
import { useEffect } from 'react'

const DailyGoals = () => {
    const [goals,setGoals] = useState([])
    const [title,setTitle] = useState('')
    const [editingId,setEditingId] = useState(null)
    const [editText,setEditText] = useState('')
    const today = getToday()

    const load = async()=>{
        const res = await API.get(`/daily-goals?date=${today}`)
        setGoals(res.data)
    }
    const addGoal = async()=>{
        if(!title.trim()) return;
        await API.post('/daily-goals',{
            title,
            date:today,
            
        })
        setTitle('')
        load()
    }
    const remove = async(id)=>{
        await API.delete(`/daily-goals/${id}`)
        load()
    }

   const updateGoal = async (id) => {
  if (!editText.trim()) return;

  await API.patch(`/daily-goals/${id}`, {
    title: editText.trim()
  });

  setEditingId(null);
  setEditText("");
  load();
};


    const toggle = async(id)=>{
        await API.patch(`/daily-goals/${id}/toggle`)
        load()
    }
    const getTodayDateLabel = () => {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};
const todayLabel = getTodayDateLabel();
    useEffect(()=>{
        load()
    },[today])

    
  return (
<div className="bg-white border border-border rounded-lg p-4 mt-6">
     
       <h3 className="font-semibold mb-1">📅 Today’s Goals</h3>
      
     <p className="text-medium mb-2 text-gray-800 ">
        {todayLabel}
      </p>

      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 bg-transparent border border-border rounded px-3 py-1"
          placeholder="New daily goal..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button
          onClick={addGoal}
          className="bg-black px-4 rounded text-white cursor-pointer hover:bg-gray-900"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {goals.map(goal => (
         <li
  key={goal._id}
  className="flex items-center justify-between hover:bg-[#c5c5c5] px-2 py-1 rounded"
>
  {/* LEFT SIDE */}
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
    <span className={goal.completed ? "line-through text-gray-500" : ""}>
      {goal.title}
    </span>
  )}

  {/* RIGHT SIDE */}
  <div className="flex gap-2 items-center">
    <input
      type="checkbox"
      checked={goal.completed}
      onChange={() => toggle(goal._id)}
      className="accent-accent"
    />

    {editingId === goal._id ? (
      <button
        onClick={() => updateGoal(goal._id)}
        className="text-green-400 text-sm"
      >
        Save
      </button>
    ) : (
      <button
        onClick={() => {
          setEditingId(goal._id);
          setEditText(goal.title);
        }}
        className="text-blue-400 text-sm"
      >
        Edit
      </button>
    )}

    <button
      onClick={() => remove(goal._id)}
      className="text-red-400 text-sm"
    >
      Delete
    </button>
  </div>
</li>

        ))}
      </ul>
    </div>
  )
}

export default DailyGoals
