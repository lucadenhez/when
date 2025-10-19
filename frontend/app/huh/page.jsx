import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Huh() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col items-center gap-20">

        <div className="flex flex-col items-center gap-3">
          <p className="text-xl tracking-tight">We think you might have an expired link!</p>

          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>


        <Image
          src="/gifs/huh.gif"
          width={250}
          height={250}
          alt="meme of cat going 'huh'"
        />
      </div>
    </div>
  );
}
