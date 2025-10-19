"use client";

import example_schema from "./example_schema";

import AvailabilityCalendar from "../components/availability/AvailabilityCalendar";
import ColorKey from "../components/availability/ColorKey";
import { useParams, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import SuggestedDays from "../components/availability/SuggestedDays";
import Loading from "../components/Loading";
import { useEffect, useRef, useState } from "react";
import DayModal from "../components/availability/DayModal";
import { GetEvent } from "../../api/events/event";

export default function Availability() {
  const whenID = useParams().id;
  const swiperRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState("");
  const modalOpen = useState(false);
  const [event, setEvent] = useState(null);

  const { push } = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await GetEvent(whenID);
      console.log("Fetched event:", data);

      if (data) {
        setEvent(data);
        console.log(data);
      } else {
        push("/huh");
      }
    };

    fetchEvent();
  }, [whenID]);

  // <DayModal isOpen={modalOpen} />

  if (!event) return (
    <Loading />
  );

  return (
    <div>
      <div className="flex flex-col items-center h-screen justify-between">
        <div className="flex flex-col items-center">
          <div className="mt-20 text-center mb-12">
            <p className="font-semibold text-3xl">Thanks!</p>
            <p className="text-2xl text-black/50">When works best for you?</p>
          </div>
          <div className="w-full mb-7">
            <ColorKey max={event.numPeople} />
          </div>
          <div className="w-full mb-5">
            <div className="flex justify-center gap-10 items-center">
              <div className="flex justify-between items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#5EAA52]" />
                <p>Selected Days</p>
              </div>
              <div className="flex justify-between items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#D57070]" />
                <p>Today</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-full sm:max-w-1/3 h-full">
          <Swiper
            modules={[Pagination, Scrollbar, A11y]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop
            className="w-full h-full"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            <SwiperSlide className="flex items-center justify-center h-full">
              <AvailabilityCalendar
                data={event.schema}
                max={event.numPeople}
                selectedDay={selectedDay}
              />
            </SwiperSlide>

            <SwiperSlide className="flex items-center justify-center h-full">
              <div className="pr-5 mx-10">
                <SuggestedDays
                  dates={[
                    { day: "10-24-2025", prettyDay: "Fri, Oct 24", time: "17:15" },
                    { day: "10-20-2025", prettyDay: "Mon, Oct 20", time: "10:00" },
                    { day: "10-27-2025", prettyDay: "Mon, Oct 27", time: "19:30" },
                  ]}
                  swiperRef={swiperRef}
                  setSelectedDay={setSelectedDay}
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <p className="mb-12 text-sm text-black/50 font-semibold">
          Swipe to view suggested days
        </p>
      </div>
    </div>
  );
}

// 