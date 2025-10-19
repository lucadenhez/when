import ColorKey from "../components/availability/ColorKey";
import AvailabilityCalendar from "../components/availability/AvailabilityCalendar";
import example_schema from "./example_schema";

export default function Availability() {
  return (
    <div className="flex flex-col m-10 items-center">
      <div className="my-30 text-center">
        <p className="font-semibold text-4xl">Thanks!</p>
        <p className="text-xl text-black/50">When works best for you?</p>
      </div>

      <div className="w-2/3">
        <ColorKey min={1} max={12} />
      </div>

      <div className="w-full">
        <AvailabilityCalendar props={example_schema} />
      </div>
    </div>
  );
}