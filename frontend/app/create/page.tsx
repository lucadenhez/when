"use client";

import { motion } from "motion/react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import DesktopForm from "../components/form/desktop";
import MobileForm from "../components/form/mobile_form";

interface Props {
  containerRef: MutableRefObject<HTMLDivElement | null>;
}

const MovingButterfly = ({ containerRef }: Props) => {
  return (
    <div className="text-center w-full flex justify-center z-10 animate-bounce">
      <motion.div drag dragConstraints={containerRef}>
        <img className="size-10" src={"images/icons/when_icon.png"}></img>
      </motion.div>
    </div>
  );
};

const useIsMobile = (breakpoint = 768) => {
  // usually 768 pixels for phone size
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize(); // Initial check

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};

interface FormData {
  EventName: string;
  ShortName: string;
  Description: string;
  Hours: number;
  Minutes: number;
  Location: string;
  LatestDate: string;
}

export default function CreateForm() {
  const [eventName, setEventName] = useState("");

  const [shortName, setShortName] = useState("");

  const [description, setDescription] = useState("");

  const [hours, setHours] = useState(0);

  const [minutes, setMinutes] = useState(0);

  const [location, setLocation] = useState("");

  const [latestDate, setLatestDate] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#89CFF0_100%)]"></div>

      <div
        ref={containerRef}
        className="w-full min-h-screen flex justify-center items-center"
      >
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="z-100"
          >
            <MovingButterfly containerRef={containerRef} />
          </motion.div>
          {!useIsMobile() ? (
            <DesktopForm
              eventName={eventName}
              setEventName={setEventName}
              shortName={shortName}
              setShortName={setShortName}
              description={description}
              setDescription={setDescription}
              hours={hours}
              setHours={setHours}
              minutes={minutes}
              setMinutes={setMinutes}
              location={location}
              setLocation={setLocation}
              latestDate={latestDate}
              setLatestDate={setLatestDate}
            />
          ) : (
            <MobileForm
              eventName={eventName}
              setEventName={setEventName}
              shortName={shortName}
              setShortName={setShortName}
              description={description}
              setDescription={setDescription}
              hours={hours}
              setHours={setHours}
              minutes={minutes}
              setMinutes={setMinutes}
              location={location}
              setLocation={setLocation}
              latestDate={latestDate}
              setLatestDate={setLatestDate}
            />
          )}
        </div>
      </div>
    </>
  );
}
