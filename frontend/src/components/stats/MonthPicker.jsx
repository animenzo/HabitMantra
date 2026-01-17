const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function MonthPicker({ value, onChange }) {
  const { year, month } = value;

  return (
    <select
      className="border rounded px-2 py-1 text-sm"
      value={`${year}-${month}`}
      onChange={(e) => {
        const [y, m] = e.target.value.split("-");
        onChange({ year: +y, month: +m });
      }}
    >
      {Array.from({ length: 3 }).map((_, y) => {
        const currentYear = new Date().getFullYear() - y;
        return months.map((m, i) => (
          <option
            key={`${currentYear}-${i + 1}`}
            value={`${currentYear}-${i + 1}`}
          >
            {m} {currentYear}
          </option>
        ));
      })}
    </select>
  );
}
