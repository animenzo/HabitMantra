import React from 'react'
import { useState } from 'react'
import API from '../services/api';

const HabitForm = ({refresh}) => {
    const [name, setName] = useState('');
    const submitHandler = async(e) => {
        e.preventDefault();
        await API.post("/habits",{name})
        setName('');
        refresh();

    }
  return (
      <div className="flex gap-2 mb-4">
      <input
        className="bg-transparent border border-border rounded px-3 py-1 outline-none focus:border-accent"
        placeholder="New habit..."
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button
        onClick={submitHandler}
        className="bg-black px-4 py-1 rounded text-white hover:opacity-90"
      >
        Add
      </button>
    </div>
  )
}

export default HabitForm
