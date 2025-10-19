import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-8" />
        <p>Loading</p>
      </div>
    </div>
  );
}
