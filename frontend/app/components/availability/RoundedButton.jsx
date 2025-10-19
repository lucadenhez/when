export default function RoundedButton({ text, color = "#F0F0F0" }, ...props) {
  return (
    <div
      className="font-semibold w-full py-3 border-2 border-black/5 flex justify-center items-center rounded-2xl" {...props}
      style={{ backgroundColor: color }}
    >
      <p>{text}</p>
    </div>
  );
}