"use client";

import { useState } from "react";
import Image from "next/image";

export default function SuggestedDays({
  dates,
  swiperRef,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  modalRef
}) {
  const handleClick = (date) => {
    setSelectedDate(date.date);
    setSelectedTime(date.startTime);
    swiperRef.current?.slidePrev();

    setTimeout(() => {
      if (modalRef?.current) {
        modalRef.current.open();
      }
    }, 200);
  };

  return (
    <div className="flex flex-col gap-3 mt-3 ml-3 w-full">
      {dates.map((date, index) => {
        // Check if this button is the selected one
        const isSelected = date.date === selectedDate && date.startTime === selectedTime;

        return (
          <div key={index} className="relative">
            <Image
              src="/images/icons/confirmation/checkmark.svg"
              className="absolute -top-3 -left-3 z-10"
              width={30}
              height={30}
              alt="checkmark"
              hidden={!isSelected}
            />
            <button
              className="relative z-0 border-2 text-center rounded-2xl bg-[#F0F0F0] w-full py-3 font-semibold overflow-visible"
              style={{ borderColor: isSelected ? "#5EAA52" : "" }}
              onClick={() => handleClick(date)}
            >
              <p>{`${date.displayDate} @ ${date.displayTime}`}</p>
            </button>
          </div>
        );
      })}
    </div>
  );
}
