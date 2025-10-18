"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PhoneInput } from "../components/authentication/PhoneInput";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-5">
      <p className="text-center font-semibold text-3xl">Welcome to When</p>
        <form
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-5"
        >
          <PhoneInput defaultCountry="US" placeholder="Phone Number" />
          <Button disabled={isLoading}>
            {isLoading ? (
              <p>Loading...</p>
            ) : <p>Send verification code</p>}

          </Button>
        </form>
    </div>
  );
}