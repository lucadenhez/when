"use client";

import { MutableRefObject, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FormLandingPage from "./form_landing_page";
import NameAndDescription from "./name_and_description";
import DurationAndDate from "./duration_and_date";

const slideVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: "0%", opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
  transition: { type: "tween", duration: 0.35, ease: "easeInOut" },
};

interface MobileFormProps {
  eventName: string;
  setEventName: (value: string) => void;
  shortName: string;
  setShortName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  hours: number;
  setHours: (value: number) => void;
  minutes: number;
  setMinutes: (value: number) => void;
  location: string;
  setLocation: (value: string) => void;
  latestDate: string;
  setLatestDate: (value: string) => void;
}

export default function MobileForm({
  eventName,
  setEventName,
  shortName,
  setShortName,
  description,
  setDescription,
  hours,
  setHours,
  minutes,
  setMinutes,
  location,
  setLocation,
  latestDate,
  setLatestDate,
}: MobileFormProps) {
  const [currentForm, setCurrentForm] = useState(1);

  const [submitted, setSubmitted] = useState(false);

  const handleSlidePlus = () => {
    setCurrentForm(currentForm + 1);
  };

  return (
    <div className="w-full max-h-screen">
      <AnimatePresence initial={true} mode="wait">
        {currentForm === 1 && (
          <FormLandingPage
            currentForm={currentForm}
            handleSlidePlus={handleSlidePlus}
          />
        )}

        {currentForm === 2 && (
          <motion.div
            key="name-and-description"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full p-4"
          >
            <NameAndDescription
              currentForm={currentForm}
              handleSlidePlus={handleSlidePlus}
              eventName={eventName}
              setEventName={setEventName}
              shortName={shortName}
              setShortName={setShortName}
              description={description}
              setDescription={setDescription}
            />
          </motion.div>
        )}

        {currentForm === 3 && (
          <motion.div
            key="duration-and-date"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full p-4"
          >
            <DurationAndDate
              eventName={eventName}
              shortName={shortName}
              description={description}
              hours={hours}
              setHours={setHours}
              minutes={minutes}
              setMinutes={setMinutes}
              location={location}
              setLocation={setLocation}
              latestDate={latestDate}
              setLatestDate={setLatestDate}
              submitted={submitted}
              setSubmitted={setSubmitted}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
