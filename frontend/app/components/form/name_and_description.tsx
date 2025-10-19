import { motion } from "framer-motion";
import { toast } from "sonner";

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
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (eventName === "") {
      console.log("test");
      toast.error("Please enter the event's name.");
      return;
    }
    if (shortName === "") {
      toast.error("Please enter the event's abbreviation.");
      return;
    }
    if (description === "") {
      toast.error("Please enter the event's description.");
      return;
    }
    handleSlidePlus();
  };

  return (
    <form className="w-full text-sm" onSubmit={handleFormSubmit}>
      <div className="w-full m-auto space-y-5">
        <p className="font-light text-center">
          ----------- Event Name & Description -----------
        </p>
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Event name <span className="text-red-500">*</span>
          </label>
          <input
            className="border border-slate-300 focus:border-slate-900 rounded-md text-sm p-2 w-full transition-all duration-200"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Abbreviation (10 characters max){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            className="border border-slate-300 focus:border-slate-900 text-sm p-2 w-full rounded-md transition-all duration-200"
            maxLength={10}
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            className="border border-slate-300 focus:border-slate-900 text-sm p-2 w-full rounded-md transition-all duration-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="max-w-[90%] m-auto">
          <motion.button
            className="w-full bg-blue-400 hover:bg-blue-500 text-sm text-white font-bold py-3 px-5 rounded-full transition-colors"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </div>
      </div>
    </form>
  );
}
