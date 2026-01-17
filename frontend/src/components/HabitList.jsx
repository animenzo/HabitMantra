import React from 'react'
import HabitCard from './HabitCard'

const HabitList = ({habits, refresh}) => {
  return habits.map((habit)=>{
        <HabitCard key={habit._id} habit={habit} refresh={refresh} />
     })
}

export default HabitList
