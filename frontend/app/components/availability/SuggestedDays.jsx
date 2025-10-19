"use client";

import { useState } from "react";
import Image from "next/image";

export default function SuggestedDays({ dates, swiperRef, setSelectedDay }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col gap-3 mt-3 ml-3 w-full">
      {dates.map((date, index) => (
        <div key={index} className="relative">
          <Image
            src="images/icons/confirmation/checkmark.svg"
            className="absolute -top-3 -left-3 z-10"
            width={30}
            height={30}
            alt="checkmark"
            hidden={index !== selected}
          />
          <button
            className="relative z-0 border-2 text-center rounded-2xl bg-[#F0F0F0] w-full py-3 font-semibold overflow-visible"
            style={{ borderColor: index === selected ? "#5EAA52" : "" }}
            onClick={() => {
              setSelected(index);
              setSelectedDay(date.day); // troubleshoot
              setTimeout(() => {
                swiperRef.current?.slidePrev();
                // open modal here
              }, 250);
            }}
          >
            <p>{`${date.prettyDay} @ ${date.time}`}</p>
          </button>
        </div>
      ))}
    </div>
  );
}