import HabitRow from "./HabitRow";

export default function HabitTable({ habits, year, month, refresh }) {
  const days = Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1
  );

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse w-full text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10 px-3 py-2 text-left">
              Habit
            </th>

            {days.map(d => (
              <th key={d} className="px-2 py-2 text-gray-500 font-normal">
                {d}
              </th>
            ))}

            <th className="px-3 py-2 text-gray-400">%</th>
          </tr>
        </thead>

        <tbody>
          {habits.map(habit => (
            <HabitRow
              key={habit._id}
              habit={habit}
              days={days}
              year={year}
              month={month}
              refresh={refresh}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
