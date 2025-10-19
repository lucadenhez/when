"use client";

import example_schema from "./example_schema";

import AvailabilityCalendar from "../components/availability/AvailabilityCalendar";
import Tabination from "../components/availability/Tabination";
import ColorKey from "../components/availability/ColorKey";
import { useParams } from 'next/navigation';

export default function Availability() {
  const whenID = useParams().id;





  return (
    <div className="flex flex-col items-center h-screen justify-between ">
      <div className="flex flex-col items-center gap-12">
        <div className="mt-20 text-center">
          <p className="font-semibold text-3xl">Thanks!</p>
          <p className="text-2xl text-black/50">When works best for you?</p>
        </div>
        <div className="w-1/2">
          <ColorKey min={1} max={4} />
        </div>
      </div>
    
      <div className="w-full flex flex-col items-center mb-7 gap-10">
        <AvailabilityCalendar data={example_schema} min={1} max={4} />
        <Tabination />
        <p className="text-sm text-black/50 font-semibold">Swipe to the left to view suggested days</p>
      </div>
    </div>
  );
}

// 