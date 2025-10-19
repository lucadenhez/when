"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import DesktopForm from "../components/form/desktop";
import MobileForm from "../components/form/mobile_form";

const useIsMobile = (breakpoint = 768) => {
  // usually 768 pixels for phone size
  const [isMobile, setIsMobile] = useState(false);

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

export default function CreateForm() {

  let randomCode = generateRandomCode();
  console.log(`Random code: ${randomCode}`);

  const [eventName, setEventName] = useState("");

  const [shortName, setShortName] = useState("");

  const [description, setDescription] = useState("");

  const [hours, setHours] = useState(0);

  const [minutes, setMinutes] = useState(0);

  const [location, setLocation] = useState("");

  const [latestDate, setLatestDate] = useState("");

  return (
    <div className="h-screen w-screen flex justify-center items-center">
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
  );
}
