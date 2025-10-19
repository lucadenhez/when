export default function ColorKey({ max }, ...props) {
  return (
    <div className="flex flex-col gap-2" {...props}>
      <div className="flex justify-between text-black/50">
        <p>1 person</p>
        <p>{`${max}+`}</p>
      </div>
      <div className="h-2 rounded-xl bg-linear-to-r from-[#F5F5F5] to-[#1F72E6]" />
    </div>
  );
}