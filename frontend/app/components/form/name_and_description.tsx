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
    <form className="space-y-2 w-full">
      <div>
        <label className="block text-sm font-medium">Event Name</label>
        <input
          className="border border-black p-2 w-full rounded"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Short Event Name</label>
        <input
          className="border border-black p-2 w-full rounded"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          className="border border-black p-2 w-full rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors w-full"
        onClick={handleNextClick}
        type="submit"
      >
        Next
      </button>
    </form>
  );
}
