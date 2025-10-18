interface CalendarUploadProps {
  Title: string;
  Description: string;
  Image: string; // This is the SVG string
}

export default function CalendarUpload({
  Title,
  Description,
  Image,
}: CalendarUploadProps) {
  return (
    <div className="border-2 p-5 flex items-center space-x-5 rounded-3xl">
      <div
        className="w-12 h-12 flex flex-shrink-0 justify-center items-center"
        dangerouslySetInnerHTML={{ __html: Image }}
      />
      <div className="text-left">
        <h1 className="font-medium text-lg">{Title}</h1>
        <p className="font-light">{Description}</p>
      </div>
    </div>
  );
}
