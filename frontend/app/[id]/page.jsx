"use client";

import example_schema from "./example_schema";

import AvailabilityCalendar from "../components/availability/AvailabilityCalendar";
import Tabination from "../components/availability/Tabination";
import ColorKey from "../components/availability/ColorKey";
import { useParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import SuggestedDays from "../components/availability/SuggestedDays";

export default function Availability() {
  const whenID = useParams().id;





  return (
    <div className="flex flex-col items-center h-screen justify-between">
      <div className="flex flex-col items-center gap-12">
        <div className="mt-20 text-center">
          <p className="font-semibold text-3xl">Thanks!</p>
          <p className="text-2xl text-black/50">When works best for you?</p>
        </div>
        <div className="w-1/2">
          <ColorKey min={1} max={4} />
        </div>
      </div>


      <div className="w-full max-w-[90vw]">
        <Swiper
          modules={[Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="w-full"
        >
          <SwiperSlide className="flex justify-center">
            <AvailabilityCalendar data={example_schema} min={1} max={4} />
          </SwiperSlide>
          <SwiperSlide className="flex justify-center">
            <SuggestedDays />
          </SwiperSlide>
        </Swiper>
      </div>

      <p className="mb-12 text-sm text-black/50 font-semibold">
        Swipe to the left to view suggested days
      </p>
    </div>
  );
}

// 