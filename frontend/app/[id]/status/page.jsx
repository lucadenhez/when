"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GetBestTime } from "@/api/events/event";
import Loading from "@/app/components/Loading";

export default function Status() {
  const { id: whenID } = useParams();
  const [bestTimeFound, setBestTimeFound] = useState(null);

  useEffect(() => {
    if (!whenID) return;

    GetBestTime(whenID).then((result) => {
      setBestTimeFound(result);
    });
  }, [whenID]);

  if (bestTimeFound === null) {
    return (
      <Loading />
    );
  }

  return (
    <div className="text-black h-screen w-full flex justify-center items-center px-10">
      <div className="flex flex-col gap-5 text-left font-semibold leading-none text-xl">
        <p>{`${bestTimeFound.split('.')[0]}.`}</p>
        <p>{bestTimeFound.split('.')[1]}</p>
      </div>
    </div>
  );
}