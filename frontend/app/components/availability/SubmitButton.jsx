"use client";

import { useState, useEffect } from "react";
import { AddBestTime } from "@/api/events/event";
import { useRouter } from "next/navigation";

export default function SubmitButton({ selectedTime, selectedDate, whenID}) {
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success" | "error"
  const { push } = useRouter();

  useEffect(() => {
    let id;
    if (status === "success" || status === "error") {
      setTimeout(() => {
        push(`/${whenID}/status`);
      }, 1000);
    }
    return () => clearTimeout(id);
  }, [status]);

  const handleClick = async () => {
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      // Ensure selectedTime is a string before passing it
      await AddBestTime(whenID, selectedDate, selectedTime.toString());

      setStatus("success");
    } catch (err) {
      setStatus("error");
      console.log(err);
    }
  };

  const label =
    status === "submitting"
      ? "Submitting..."
      : status === "success"
        ? "Done!"
        : status === "error"
          ? "Whoops"
          : "That works!";

  const backgroundColor =
    status === "success"
      ? "#5EAA52"
      : status === "error"
        ? "#FF6B6B"
        : selectedTime
          ? "#5EAA52"
          : "#F0F0F0";

  const color =
    status === "success" || status === "error" || selectedTime ? "#ffffff" : "#000000";

  return (
    <button
      className="font-semibold w-full py-3 border-2 border-black/5 flex justify-center items-center rounded-2xl"
      style={{ backgroundColor, color }}
      onClick={handleClick}
      disabled={status === "submitting"}
    >
      <p>{label}</p>
    </button>
  );
}