"use client";

import { useMemo } from "react";


export default function AvailabilityCalendar({ data, max, selectedDay }) {
  console.log(data);
  const allDates = Object.keys(data).map((d) => new Date(d));
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));

  const startDate = new Date(minDate);
  startDate.setDate(startDate.getDate() - 7);

  const RANGE_DAYS = 30;
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

  const days = useMemo(() => {
    const arr = [];
    let current = new Date(startDate.getTime());

    while (current <= endDate) {
      let peopleAvailable = 0;

      for (const [day, people] of Object.entries(data)) {
        const [month, d, year] = day.split("-").map(Number);
        const targetDate = new Date(year, month - 1, d);

        const isSameDay =
          current.getFullYear() === targetDate.getFullYear() &&
          current.getMonth() === targetDate.getMonth() &&
          current.getDate() === targetDate.getDate();

        if (isSameDay) {
          peopleAvailable = people.availableCount;
          break;
        }
      }

      arr.push([new Date(current), peopleAvailable]);
      current.setDate(current.getDate() + 1);
    }

    return arr;
  }, [startDate, endDate, data.availableDays]);

  const weeks = useMemo(() => {
    const weeksArr = [];
    let currentWeek = new Array(7).fill(null);
    days.forEach((dateObj) => {
      const dayOfWeek = dateObj[0].getDay(); // 0=Sun
      currentWeek[dayOfWeek] = dateObj;

      if (dayOfWeek === 6) {
        weeksArr.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
    });

    if (currentWeek.some((x) => x)) weeksArr.push(currentWeek);
    return weeksArr;
  }, [days]);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl">
      <p className="font-semibold ml-1">{monthsText}</p>

      <div className="flex justify-between pb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <p key={d} className="w-10 text-center">
            {d}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-0">
            {week.map((dateObj, j) => {
              const selected = dateObj && dateObj[1] > 0;
              const leftSelected = j > 0 && week[j - 1] && week[j - 1][1] > 0;
              const rightSelected = j < 6 && week[j + 1] && week[j + 1][1] > 0;

              let isSelectedDay, isToday;

              if (dateObj) {
                isSelectedDay = new Date(selectedDay).toDateString() === dateObj[0].toDateString();
                isToday = new Date().toDateString() === dateObj[0].toDateString();
              }

              return (
                <div
                  key={j}
                  className="w-10 h-10 flex items-center justify-center rounded-md"
                  style={{
                    backgroundColor: isSelectedDay ? "#5EAA52" : dateObj ? `rgba(8, 67, 150, ${dateObj[1] / max})` : "transparent",
                    border: dateObj && isToday ? "3px solid" : "",
                    borderColor: isToday ? "#D57070" : ""
                  }}
                >
                  <p style={{ color: dateObj && dateObj[1] / max > 0.5 ? "#ffffff" : "#000000" }}>
                    {dateObj ? dateObj[0].getDate() : ""}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
