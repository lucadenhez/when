"use client";

import { motion } from "motion/react";
import { AuroraBackground } from "@/components/ui/shadcn-io/aurora-background";
import CalendarUpload from "../components/calendar_upload";

interface CalendarChoice {
  Id: number;
  Title: string;
  Description: string;
  Image: string;
}

export default function UploadCalendar() {
  const calendar_upload_choices: CalendarChoice[] = [
    {
      Id: 1,
      Title: "Google Calendar",
      Description: "Gmail, Google Tasks, etc.",
      Image: "/images/icons/calendars/google_cal.svg",
    },
    {
      Id: 2,
      Title: "Apple Calendar",
      Description: "iCloud",
      Image: "/images/icons/calendars/apple_cal.svg",
    },
    {
      Id: 3,
      Title: "Outlook Calendar",
      Description: "Microsoft 365, Office",
      Image: "/images/icons/calendars/outlook_cal.svg",
    },
    {
      Id: 4,
      Title: "Scan your planner",
      Description: "Take a photo of your physical planner",
      Image: "/images/icons/calendars/scan_planner.png",
    },

    {
      Id: 5,
      Title: "I don't have a calendar",
      Description: "Enter your availability manually",
      Image: "/images/icons/calendars/no_planner.png",
    },
  ];

  return (
    // <AuroraBackground>
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#89CFF0_100%)]"></div>

      <div className="h-screen flex items-center justify-center animate-aurora">
        <div className="text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex justify-center">
              <h1 className="text-3xl font-bold sm:max-w-[70%] max-w-[80%]">
                Import your favorite calendar to join this event
              </h1>
            </div>
          </motion.div>
          <div className="space-y-3 max-w-[80%] m-auto">
            {calendar_upload_choices.map((calendar_choice: CalendarChoice) => (
              <CalendarUpload
                key={calendar_choice.Title}
                {...calendar_choice}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
