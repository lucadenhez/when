export default function AvailabilityCalendar(props) {
  const months = ["Oct", "Nov"];
  const years = [2025, 2025]; // Length MUST be 2 for now

  return (
    <div className="bg-zinc-200 flex flex-col gap-2">
      <p className="font-semibold">{months.length > 1 ? `${months[0]} ${years[0]} — ${months[1]} ${years[1]}` : months[0] + " " + years[0]}</p>
      <div className="flex flex-col gap-10">
        <div className="flex justify-between">
          <p>Sun</p>
          <p>Mon</p>
          <p>Tue</p>
          <p>Wed</p>
          <p>Thu</p>
          <p>Fri</p>
          <p>Sat</p>
        </div>
        <div className="flex justify-between">
          {
            
          }
        </div>
      </div>
    </div>
  );
}