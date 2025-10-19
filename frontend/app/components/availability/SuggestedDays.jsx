"use client";

export default function SuggestedDays({ days }) {
  

  const day = "Fri, Oct 24";
  const time = "5pm";

  return (
    <div className="flex flex-col gap-3">
      <div className="border-2 border-black/5 text-center rounded-2xl bg-[#F0F0F0] w-full py-3 font-semibold">
        <p>{`${day} @ ${time}`}</p>
      </div>
    </div>
  );
}