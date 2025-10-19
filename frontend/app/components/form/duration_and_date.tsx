import { motion } from "framer-motion";

interface DurationAndDateProps {
  hours: number;
  setHours: (value: number) => void;
  minutes: number;
  setMinutes: (value: number) => void;
  location: string;
  setLocation: (value: string) => void;
  latestDate: string;
  setLatestDate: (value: string) => void;
  submitted: boolean;
  setSubmitted: (value: boolean) => void;
}

export default function DurationAndDate({
  hours,
  setHours,
  minutes,
  setMinutes,
  location,
  setLocation,
  latestDate,
  setLatestDate,
  submitted,
  setSubmitted,
}: DurationAndDateProps) {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form className="space-y-4 max-w-[80%] m-auto">
      {" "}
      <div>
        <div className="flex space-x-2">
          <div>
            <label className="block text-sm font-medium">Hours</label>
            <select
              className="border border-black p-2 w-full rounded"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Minutes</label>
            <select
              className="border border-black p-2 w-full rounded"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Event Location</label>
        <input
          className="border border-black p-2 w-full rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Latest Date</label>
        <input
          className="border border-black p-2 w-full rounded"
          placeholder="MM-DD-YYYY"
          value={latestDate}
          onChange={(e) => setLatestDate(e.target.value)}
        />
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          onClick={handleSubmit}
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
