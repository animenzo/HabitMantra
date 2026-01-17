export default function MonthCompareCard({ title, data }) {
  return (
    <div className="bg-white border rounded-xl p-4 w-full">
      <h4 className="font-medium mb-3">{title}</h4>

      <div className="space-y-2 text-sm">
        <p>✅ Completed Days: <b>{data.completedDays}</b></p>
        <p>📅 Total Days: <b>{data.totalDays}</b></p>
        <p>📈 Completion Rate: <b>{data.completionRate}%</b></p>
      </div>

      <div className="mt-4 h-2 bg-gray-200 rounded">
        <div
          className="h-full bg-green-500 rounded"
          style={{ width: `${data.completionRate}%` }}
        />
      </div>
    </div>
  );
}
