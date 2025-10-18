"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { PhoneInput } from "../components/authentication/PhoneInput";
import { setupRecaptcha, sendVerificationCode, verifyCodeAndSignIn } from "../../api/firebase/auth";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const handleSendCode = async () => {
    const result = await sendVerificationCode(phoneNumber);
    setConfirmationResult(result);
  };

  const handleVerifyCode = async () => {
    const verify = await verifyCodeAndSignIn(confirmationResult, verificationCode)
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-5">
      <p className="text-center font-semibold text-3xl">Welcome to When</p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-5"
      >
        <PhoneInput
          defaultCountry="US"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target)}
        />
        <Button disabled={isLoading} onClick={() => handleSendCode() }>
          {isLoading ? (
            <p>Loading...</p>
          ) : <p>Send verification code</p>}

        </Button>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
}