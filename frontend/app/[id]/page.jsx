"use client";

import example_schema from "./example_schema";
import AvailabilityCalendar from "../components/availability/AvailabilityCalendar";
import ColorKey from "../components/availability/ColorKey";
import { useParams } from 'next/navigation';

export default function Availability() {
  const whenID = useParams().id;

  return (
    <div className="flex flex-col items-center">
      <div className="my-30 text-center">
        <p className="font-semibold text-4xl">Thanks!</p>
        <p className="text-xl text-black/50">When works best for you?</p>
      </div>

      <div className="w-2/3">
        <ColorKey min={1} max={4} />
      </div>

      <div className="w-full px-5">
        <AvailabilityCalendar data={example_schema} min={1} max={4} />
      </div>
    </div>
  );
}

// 