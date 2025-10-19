"use client";

import { StringToBoolean } from "class-variance-authority/types";
import { motion } from "motion/react";

interface DesktopFormProps {
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
    randomCode: string;
}

export default function DesktopForm({
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
}: DesktopFormProps) {
  return (
    <div className="flex justify-center items-center text-center border-2 shadow-2xl border-blue-200 rounded-xl p-20 w-full max-w-[80%] h-screen max-h-[80%]">
      <div className="space-y-16">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold">Hello, [name]!</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold">Let's get that event set up.</h2>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.5,
            duration: 1,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button className="p-5 bg-blue-400 hover:bg-blue-500 hover:cursor-pointer text-3xl rounded-2xl text-white transition-all duration-200">
              Get started
            </button>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
