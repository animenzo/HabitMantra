const formatDate = (d) =>
  d.toLocaleDateString("en-CA"); // YYYY-MM-DD

export const getLast365Days = (year) => {
  const days = [];

  const end = new Date(year, 11, 31);
  const start = new Date(end);
  start.setDate(start.getDate() - 364);

  // align to Sunday
  while (start.getDay() !== 1) {
    start.setDate(start.getDate() - 1);
  }

  const current = new Date(start);

  // 🔥 HARD LIMIT — prevents infinite loop
  for (let i = 0; i < 364; i++) {
    days.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};


export const getDaysByMonth = (year) => {
  const months = [];

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const firstDay = new Date(year, m, 1).getDay(); // 0=Sun
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon-based

    const cells = [];

    // empty cells before month starts
    for (let i = 0; i < offset; i++) {
      cells.push(null);
    }

    // real days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, m, d).toISOString().slice(0, 10);
      cells.push(date);
    }

    months.push({
      label: new Date(year, m, 1).toLocaleString("default", {
        month: "short"
      }),
      cells
    });
  }

  return months;
};



export const getHeatColor = (count) => {
  if (count === 0) return "bg-gray-200";
  if (count === 1) return "bg-green-200";
  if (count === 2) return "bg-green-400";
  if (count >= 3) return "bg-green-600";
};

export const getMonthLabels = (days) => {
  const labels = [];

  days.forEach((date, i) => {
    const d = new Date(date);

    if (d.getDate() === 1) {
      labels.push({
        index: Math.floor(i / 7),
        label: d.toLocaleString("default", { month: "short" })
      });
    }
  });

  return labels;
};


