import { motion } from "framer-motion";

interface NameAndDescriptionProps {
  currentForm: number;
  handleSlidePlus: () => void;
  eventName: string;
  setEventName: (value: string) => void;
  shortName: string;
  setShortName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

export default function NameAndDescription({
  currentForm,
  handleSlidePlus,
  eventName,
  setEventName,
  shortName,
  setShortName,
  description,
  setDescription,
}: NameAndDescriptionProps) {
  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSlidePlus();
  };

  return (
    <form className="w-screen">
      <div className="max-w-[80%] m-auto space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Event name</label>
          <input
            className="border border-slate-300 focus:border-slate-900 rounded-md text-sm p-2 w-full transition-all duration-200"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Abbreviation (10 characters max)
          </label>
          <input
            className="border border-slate-300 focus:border-slate-900 text-sm p-2 w-full rounded-md transition-all duration-200"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Description</label>
          <input
            className="border border-slate-300 focus:border-slate-900 text-sm p-2 w-full rounded-md transition-all duration-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="max-w-[90%] m-auto">
          <button
            className="w-full bg-blue-400 hover:bg-blue-500 text-sm text-white font-bold py-3 px-5 rounded-full transition-colors"
            onClick={handleNextClick}
            type="submit"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
}
