import { Sheet } from "react-modal-sheet";
import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import Image from "next/image";
import { GetDayHours } from "@/api/events/event";
import SubmitButton from "../../components/availability/SubmitButton";

const TimeModal = forwardRef(function TimeModal({ selectedTime, setSelectedTime, selectedDate, whenID }, ref) {
  const [open, setOpen] = useState(false);
  const roundedRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    setSelectedTime: (timeObj) => {
      roundedRef.current?.setSelectedTime(timeObj);
    },
    selectedTime: () => {
      return roundedRef.current?.selectedTime?.();
    }
  }));

  const times = Array.from({ length: 24 }, (_, i) => i);

  if (selectedDate) {
    console.log("Selected date: " + selectedDate);

    GetDayHours(whenID, selectedDate).then((hours) => {
      console.log("Hours:", hours);
    });
  }



  // style={{ backgroundColor: isSelectedDay ? "#5EAA52" : dateObj ? `rgba(8, 67, 150, ${dateObj[1] / max})` : "transparent" }}

  return (
    <Sheet isOpen={open} onClose={() => setOpen(false)} snapPoints={[0, 0.75, 1]} initialSnap={1}>
      <Sheet.Container>
        <Sheet.Header>
          <div className="flex flex-col items-center w-full">
            <p className="p-10 font-semibold text-xl">Select Time</p>
          </div>
        </Sheet.Header>
        <Sheet.Content>
          <div className="mx-5 pr-5">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-3 ml-3 w-full">
              {times.map((hour, i) => {
                const displayTime = hour.toString().padStart(2, "0") + ":00";
                const dataTime = hour.toString();

                // console.log(dataTime);

                return (
                  <div key={i} className="relative">
                    <Image
                      src="/images/icons/confirmation/checkmark.svg"
                      className="absolute -top-3 -left-3 z-10"
                      width={30}
                      height={30}
                      alt="checkmark"
                      hidden={selectedTime && dataTime !== selectedTime.substr(0, 2)}
                    />
                    <button
                      className={`relative z-0 border-2 text-center rounded-xl w-full py-2 font-semibold transition-all duration-150 ${selectedTime && dataTime === selectedTime.substr(0, 2) ? "border-[#5EAA52] scale-105" : "border-transparent"}`}

                      onClick={() => {
                        setSelectedTime(dataTime);
                      }}
                    >
                      <p>{displayTime}</p>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-20 ml-5">
              <SubmitButton
                selectedTime={selectedTime}
                selectedDate={selectedDate}
                whenID={whenID}
                modalRef={ref}
              />
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
});

export default TimeModal;
