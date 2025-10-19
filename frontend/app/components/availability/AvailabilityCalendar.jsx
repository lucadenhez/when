"use client";

import { useMemo } from "react";

export default function AvailabilityCalendar({ data }) {
  // --- Compute date range dynamically ---
  const allDates = data.availableDays.map((d) => new Date(d.day));
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));

  // Optionally include a small buffer before start
  const startDate = new Date(minDate);
  startDate.setDate(startDate.getDate() - 7); // optional; can remove if not desired

  // Show X days after the min date
  const RANGE_DAYS = 30; // ← change this to any number you like
  const endDate = new Date(minDate);
  endDate.setDate(endDate.getDate() + RANGE_DAYS);

  const minMonth = startDate.toLocaleString("default", { month: "short" });
  const maxMonth = endDate.toLocaleString("default", { month: "short" });
  const minYear = startDate.getFullYear();
  const maxYear = endDate.getFullYear();

  let monthsText;
  if (minMonth === maxMonth && minYear === maxYear) {
    monthsText = `${minMonth} ${minYear}`;
  } else {
    monthsText = `${minMonth} ${minYear} — ${maxMonth} ${maxYear}`;
  }

  // --- Generate all days in range ---
  const days = useMemo(() => {
    const arr = [];
    let current = new Date(startDate.getTime());
    while (current <= endDate) {
      arr.push(new Date(current));
      current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
    }
    return arr;
  }, [startDate, endDate]);

  // --- Build calendar grid grouped by weeks ---
  const weeks = useMemo(() => {
    const weeksArr = [];
    let currentWeek = new Array(7).fill(null);
    days.forEach((day) => {
      const dayOfWeek = day.getDay(); // 0=Sun
      currentWeek[dayOfWeek] = day;

      // if Saturday, push week and start new
      if (dayOfWeek === 6) {
        weeksArr.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
    });
    // push any remaining days
    if (currentWeek.some((x) => x)) weeksArr.push(currentWeek);
    return weeksArr;
  }, [days]);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl">
      <p className="font-semibold text-lg text-center">{monthsText}</p>

      <div className="flex justify-between pb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <p key={d} className="w-10 text-center">
            {d}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {weeks.map((week, i) => (
          <div key={i} className="flex justify-between">
            {week.map((day, j) => (
              <div
                key={j}
                className={`w-10 h-10 flex items-center justify-center rounded-md ${day ? "bg-white" : "bg-transparent"
                  }`}
              >
                {day ? day.getDate() : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
