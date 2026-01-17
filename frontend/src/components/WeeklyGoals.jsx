import React from 'react'
import { useState } from 'react';
import API from '../services/api';
import { getWeekStart } from '../utils/weekHelpers';
import { useEffect } from 'react';


const WeeklyGoals = () => {
    const [goals,setGoals] = useState([]);

    const [title,setTitle] = useState('');

    const weekStart = getWeekStart()
//loadgoals
    const load = async()=>{
        const res = await API.get(`/weekly-goals?weekStart=${weekStart}`);
        setGoals(res.data)
    }
    const addGoal  = async()=>{
        if (!title.trim()) return;
        await API.post('/weekly-goals',{title,weekStart});
        setTitle('');
        load();
    }
    const toggle = async(id)=>{
        await API.patch(`/weekly-goals/${id}/toggle`);
        load();
    }
    useEffect(()=>{
        load()
    },[])
  return (
    <div className='bg-white border border-zinc-700 rounded-lg p-4 mt-6 '>

      <h3 className='font-semibold mb-3 flex items-center gap-2'>🔥 Weekly goals</h3>
      <div className='flex gap-2 mb-3'>
        <input className='flex-1 bg-transparent border border-zinc-500 rounded px-3 py-1' type="text" placeholder='New Weekly goal..' value={title} onChange={e=>setTitle(e.target.value)} />
        <button onClick={addGoal} className='bg-black px-4 text-white rounded'>
            Add
        </button>
      </div>
      <ul className='space-y-2'>
        {
            goals.map(goal=>(
                <li key={goal._id}
                className='flex items-center justify-between hover:bg-zinc-100 px-2 py-1 rounded'
                >
                    <span className={goal.completed ? 'line-through text-zinc-400' : ''}>
                        {goal.title}
                    </span>
                    <input type="checkbox" checked={goal.completed}
                    onChange={()=>toggle(goal._id)} className='bg-cyan-400' />

                </li>
            ))
        }
      </ul>
    </div>
  )
}

export default WeeklyGoals
