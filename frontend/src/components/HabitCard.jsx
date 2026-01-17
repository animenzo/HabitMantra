import React from 'react'
import API from '../services/api'

const HabitCard = ({habit,refresh}) => {
    const today  = new Date().toISOString().slice(0,10)
    const checked = habit.progress[today] || false;

    const toggleHandler = async() => {
        await API.patch(`/habits/${habit._id}/toggle`, {date: today});
        refresh()
    }
  return (
    <div>
      <input type="checkbox" checked={checked} onChange={toggleHandler} />
        <span>{habit.name}</span>
        <span> Streak: {habit.streak} </span>
    </div>
  )
}

export default HabitCard
