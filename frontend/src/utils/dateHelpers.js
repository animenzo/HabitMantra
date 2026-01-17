export const getDaysInMonth = (year,month)=>{
    new Date(year,month,0).getDate()
}

export const formatDate = (y, m, d) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export const getToday = () =>
  new Date().toISOString().slice(0, 10);

