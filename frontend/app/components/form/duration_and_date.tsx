import { AnimatePresence, motion } from "framer-motion";
import { CreateEvent } from "@/api/events/event";
import { CalendarForm } from "./calendar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import QRCodeDisplay from "../qrCodeDisplay";
import Link from "next/link";

function generateRandomCode(): string {
  let result = "";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 6; i++) {
    result += upperCaseLetters.charAt(
      Math.floor(Math.random() * upperCaseLetters.length)
    );
  }
  return result;
}

interface DurationAndDateProps {
  eventName: string;
  shortName: string;
  description: string;
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
  eventName,
  shortName,
  description,
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
  const router = useRouter();

  const [eventURL, setEventURL] = useState("");
  const [randomCode, setRandomCode] = useState("");
  const [qrCodeModal, setQRCodeModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const getInputValue = (date: string): string => {
    if (!date) {
      return "";
    }
    const sections = date.split("-");
    if (sections.length === 3) {
      // need to return in the format YYYY-MM-DD
      return `${sections[2]}-${sections[0]}-${sections[1]}`;
    }
    return "";
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // we want the date to go into the database MM-DD-YYYY
    const dateValue = e.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split("-");
      const formattedDate = `${month}-${day}-${year}`;
      setLatestDate(formattedDate);
    }
  };

  const handleLinkCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventURL);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000); // Reset "Link Copied!" message after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy the link. Please try again.");
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (hours === 0 && minutes === 0) {
      toast.error("Please enter a duration (hours and minutes) for the event.");
      return;
    }
    if (location === "") {
      toast.error("Please enter the event's location.");
      return;
    }
    if (latestDate === "") {
      toast.error("Please enter the event's date.");
      return;
    }
    setSubmitted(true);
    setRandomCode(generateRandomCode());
    console.log(`Random Code: ${randomCode}`);
    CreateEvent({
      code: randomCode,
      data: {
        eventName: eventName,
        shortName: shortName,
        description: description,
        hours: hours,
        minutes: minutes,
        location: location,
        latestDate: latestDate,
      },
    });
    setEventURL(`whenwhere.us/${randomCode}`);
    console.log(eventURL);
    setQRCodeModal(true);
    // router.push(`/connect/${randomCode}`);
  };

  return (
    <form className="w-full max-h-screen">
      <div className="min-w-[90%] m-auto space-y-10">
        <div className="space-y-3">
          <p className="text-sm font-light text-center">
            ----------------- Event Duration -----------------
          </p>
          <div className="flex justify-center gap-3">
            <div className="space-y-1 w-full">
              <label className="block text-sm font-medium">
                Hours <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="border border-slate-300 text-sm p-2 w-full rounded-md transition-all duration-200"
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
            </div>
            <div className="space-y-1 w-full">
              <label className="block text-sm font-medium">
                Minutes <span className="text-red-500">*</span>
              </label>
              <select
                className="border border-slate-300 text-sm p-2 w-full rounded-md transition-all duration-200"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
              >
                <option className="" value={0}>
                  0
                </option>
                <option className="" value={15}>
                  15
                </option>
                <option className="" value={30}>
                  30
                </option>
                <option className="" value={45}>
                  45
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-light text-center">
            ----------- Event Location & Latest Date -----------
          </p>
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Event location <span className="text-red-500">*</span>
            </label>
            <input
              className="border border-slate-300 focus:border-slate-900 text-sm p-2 w-full rounded-md transition-all duration-200"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Select the latest possible date{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="border border-slate-300 focus:border-slate-900 text-sm p-2 w-full rounded-md transition-all duration-200"
              value={getInputValue(latestDate)}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <motion.button
            className="w-full bg-blue-400 hover:bg-blue-500 text-sm font-bold py-3 px-5 rounded-full transition-colors"
            onClick={handleSubmit}
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex justify-center items-center text-white gap-2">
              Submit
              <svg
                fill="#000000"
                width="800px"
                height="800px"
                viewBox="0 0 56 56"
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 fill-current"
              >
                <path d="M 26.6875 12.6602 C 26.9687 12.6602 27.1094 12.4961 27.1797 12.2383 C 27.9062 8.3242 27.8594 8.2305 31.9375 7.4570 C 32.2187 7.4102 32.3828 7.2461 32.3828 6.9648 C 32.3828 6.6836 32.2187 6.5195 31.9375 6.4726 C 27.8828 5.6524 28.0000 5.5586 27.1797 1.6914 C 27.1094 1.4336 26.9687 1.2695 26.6875 1.2695 C 26.4062 1.2695 26.2656 1.4336 26.1953 1.6914 C 25.3750 5.5586 25.5156 5.6524 21.4375 6.4726 C 21.1797 6.5195 20.9922 6.6836 20.9922 6.9648 C 20.9922 7.2461 21.1797 7.4102 21.4375 7.4570 C 25.5156 8.2774 25.4687 8.3242 26.1953 12.2383 C 26.2656 12.4961 26.4062 12.6602 26.6875 12.6602 Z M 15.3438 28.7852 C 15.7891 28.7852 16.0938 28.5039 16.1406 28.0821 C 16.9844 21.8242 17.1953 21.8242 23.6641 20.5821 C 24.0860 20.5117 24.3906 20.2305 24.3906 19.7852 C 24.3906 19.3633 24.0860 19.0586 23.6641 18.9883 C 17.1953 18.0977 16.9609 17.8867 16.1406 11.5117 C 16.0938 11.0899 15.7891 10.7852 15.3438 10.7852 C 14.9219 10.7852 14.6172 11.0899 14.5703 11.5352 C 13.7969 17.8164 13.4687 17.7930 7.0469 18.9883 C 6.6250 19.0821 6.3203 19.3633 6.3203 19.7852 C 6.3203 20.2539 6.6250 20.5117 7.1406 20.5821 C 13.5156 21.6133 13.7969 21.7774 14.5703 28.0352 C 14.6172 28.5039 14.9219 28.7852 15.3438 28.7852 Z M 31.2344 54.7305 C 31.8438 54.7305 32.2891 54.2852 32.4062 53.6524 C 34.0703 40.8086 35.8750 38.8633 48.5781 37.4570 C 49.2344 37.3867 49.6797 36.8945 49.6797 36.2852 C 49.6797 35.6758 49.2344 35.2070 48.5781 35.1133 C 35.8750 33.7070 34.0703 31.7617 32.4062 18.9180 C 32.2891 18.2852 31.8438 17.8633 31.2344 17.8633 C 30.6250 17.8633 30.1797 18.2852 30.0860 18.9180 C 28.4219 31.7617 26.5938 33.7070 13.9140 35.1133 C 13.2344 35.2070 12.7891 35.6758 12.7891 36.2852 C 12.7891 36.8945 13.2344 37.3867 13.9140 37.4570 C 26.5703 39.1211 28.3281 40.8321 30.0860 53.6524 C 30.1797 54.2852 30.6250 54.7305 31.2344 54.7305 Z" />
              </svg>
            </div>
          </motion.button>
        </div>
        {qrCodeModal ? (
          <div className="fixed bg-black/50 min-h-screen w-screen z-10 flex justify-center items-center top-0 left-0">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ scale: 0 }}
                className="w-[85%] bg-white flex justify-center items-center p-10 rounded-xl shadow-xl"
              >
                <div className="text-center space-y-5">
                  <h1 className="text-md font-bold">
                    Share this QR code with your buddies:
                  </h1>
                  <QRCodeDisplay value={eventURL} size={124} fgColor="#333" />
                  <p>-------- OR --------</p>
                  <div className="flex flex-col space-y-5">
                    <button
                      onClick={handleLinkCopy}
                      className="border border-slate-500 font-bold py-2 px-4 rounded-xl flex justify-center items-center gap-3"
                      type="button"
                    >
                      {linkCopied ? "Link Copied!" : "Copy Link"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-copy"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                        />
                      </svg>
                    </button>
                    <Link href={`../../${randomCode}`}>
                      <motion.button
                        className="text-lg font-semibold bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 py-3 px-5 rounded-full text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add your availability
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <></>
        )}
      </div>
    </form>
  );
}
