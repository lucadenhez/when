import { Sheet } from "react-modal-sheet";
import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import Image from "next/image";

const TimeModal = forwardRef(function TimeModal({ selectedTime, setSelectedTime, selectedDate }, ref) {
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
                const dataTime = hour.toString().padStart(2, "0") + "00";

                console.log(dataTime);

                return (
                  <div key={i} className="relative">
                    <Image
                      src="/images/icons/confirmation/checkmark.svg"
                      className="absolute -top-3 -left-3 z-10"
                      width={30}
                      height={30}
                      alt="checkmark"
                      hidden={dataTime !== selectedTime}
                    />
                    <button
                      className={`relative z-0 border-2 text-center rounded-xl bg-[#F0F0F0] w-full py-2 font-semibold transition-all duration-150 ${dataTime === selectedTime ? "border-[#5EAA52] scale-105" : "border-transparent"
                        }`}
                      onClick={() => {
                        setSelected(i);
                        onSelect?.(hour);
                      }}
                    >
                      <p>{displayTime}</p>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
});

export default TimeModal;
