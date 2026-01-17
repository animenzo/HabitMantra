import React from 'react'

const MonthNavigation = ({year,month,setMonth,setYear}) => {
    const goPrev = ()=>{
        if(month ===1){
            setMonth(12);
            setYear(prev => prev -1);
        }else{
            setMonth(prev => prev -1);
        }
    }
    const goNext = ()=>{
        if(month === 12){
            setMonth(1);
            setYear(prev => prev +1);
        }else{
            setMonth(prev => prev +1);
        }
    }

    const monthName = new Date(year,month-1).toLocaleString('default',{month:'long'});
    // console.log(monthName);
  return (
    <div className='flex items-center justify-between mb-4'>
        <button onClick={goPrev} className='px-3 py-1 rounded hover:bg-zinc-500 bg-zinc-400'>
            Prev
        </button>
        <h2 className='text-lg font-medium'>
            {monthName} {year}
        </h2>
        <button onClick={goNext} className='px-3 py-1 rounded hover:bg-zinc-500 bg-zinc-400'>
            Next
        </button>
      
    </div>
  )
}

export default MonthNavigation
