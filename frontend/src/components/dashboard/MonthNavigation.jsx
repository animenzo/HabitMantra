import React, { useEffect } from "react";
import { MdChevronLeft, MdChevronRight, MdToday } from "react-icons/md";

const MonthNavigation = ({ year, month, setMonth, setYear }) => {
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  const goPrev = () => {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const goNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  const goToday = () => {
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only navigate if not typing in an input/textarea
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [month, year]);

  const monthName = new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
  });

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <button
        onClick={goPrev}
        aria-label="Previous Month"
        title="Previous Month (Left Arrow)"
        className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 border border-slate-200/80 transition-colors"
      >
        <MdChevronLeft size={20} />
      </button>

      <div className="px-3 py-1.5 text-center min-w-[140px] sm:min-w-[160px]">
        <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
          {monthName}
        </span>{" "}
        <span className="text-sm sm:text-base font-medium text-slate-500">
          {year}
        </span>
      </div>

      {!isCurrentMonth && (
        <button
          onClick={goToday}
          title="Jump to Current Month"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-100 transition-colors"
        >
          <MdToday size={14} />
          Today
        </button>
      )}

      <button
        onClick={goNext}
        aria-label="Next Month"
        title="Next Month (Right Arrow)"
        className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 border border-slate-200/80 transition-colors"
      >
        <MdChevronRight size={20} />
      </button>
    </div>
  );
};

export default MonthNavigation;
