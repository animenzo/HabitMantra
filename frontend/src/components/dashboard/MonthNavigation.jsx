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

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    // Attach listener only if focus is generally on body (optional refinement)
    // For now, global listener is fine for this context
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [month, year]); // Dependencies ensure state updates correctly

  const monthName = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-xl shadow-sm mb-6 max-w-lg mx-auto">
      
      {/* LEFT ARROW */}
      <button
        onClick={goPrev}
        title="Previous Month (Left Arrow)"
        className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 bg-indigo-50  hover:bg-indigo-200 transition-colors"
      >
        <MdChevronLeft size={24} />
      </button>

      {/* CENTER TEXT */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-bold text-gray-800">
          {monthName} <span className="text-gray-400 font-normal">{year}</span>
        </h2>
      </div>

      {/* RIGHT GROUP */}
      <div className="flex items-center gap-1">
        
        {/* 'Today' button only shows if we aren't on current month */}
        {!isCurrentMonth && (
          <button
            onClick={goToday}
            title="Jump to Today"
            className="hidden sm:flex items-center gap-1 px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50  hover:bg-indigo-100 rounded-md transition-colors mr-1"
          >
            <MdToday size={14} />
            Today
          </button>
        )}

        {/* RIGHT ARROW */}
        <button
          onClick={goNext}
          title="Next Month (Right Arrow)"
          className="p-2 rounded-lg bg-indigo-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-200 transition-colors"
        >
          <MdChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default MonthNavigation;