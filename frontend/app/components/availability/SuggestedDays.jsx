export default function SuggestedDays({ days }) {
  const day = "Fri, Oct 24";
  const time = "5pm";
  
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full py-3 font-semibold">
        <p>{`${day} @ ${time}`}</p>
      </div>
    </div>
  );
}