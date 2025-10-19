export default function ColorKey({ min, max }, ...props) {
  return (
    <div className="flex flex-col gap-2" {...props}>
      <div className="flex justify-between text-black/50">
        <p>{min + " " + (min > 1 ? "people" : "person")}</p>
        <p>{max + "+ " + (max > 1 ? "people" : "person")}</p>
      </div>
      <div className="h-2 rounded-xl bg-linear-to-r from-[#F5F5F5] to-[#1F72E6]" />
    </div>
  );
}