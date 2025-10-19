"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "../components/authentication/PhoneInput";
import { useRouter } from 'next/navigation';

import {
  setupRecaptcha,
  sendVerificationCode,
  verifyCodeAndSignIn,
} from "../../api/firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Login() {
  const [sentStatus, setSentStatus] = useState("Send Verification Code");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState("phone"); // phone or verification state: phone shows phone # entry, verification shows OTP form

  const { push } = useRouter();

  const form = useForm({
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const handleSendCode = async (phoneNumber) => {
    try {
      setSentStatus("Loading...");
      const result = await sendVerificationCode(phoneNumber);
      setConfirmationResult(result);
      setSentStatus("Verification code sent!");
      setTimeout(() => {
        setStep("verification");
      }, 3000);
    } catch (err) {
      console.error("Error sending code:", err);
      setSentStatus("Failed to send code. Try again.");
      setTimeout(() => {
        setSentStatus("Send Verification Code");
      }, 3000);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult || !verificationCode) return;

    try {
      // confirmationResult.confirm is the actual Firebase function
      const result = await confirmationResult.confirm(verificationCode);
      console.log("Sign in successful:", result);
      push("/create"); // only runs if no error
    } catch (err) {
      console.error("Verification failed:", err);
      setSentStatus("Invalid code. Please try again.");
      setTimeout(() => {
        setSentStatus("Send Verification Code");
      }, 1000);
    }
  };

  const onSubmit = async (data) => {
    await handleSendCode(data.phone);
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#89CFF0_100%)]"></div>

      <div className="w-full h-screen flex flex-col justify-center items-center space-y-10">
        <p className="text-center font-bold text-3xl">Create Account / Sign In</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-5 w-80"
          >
            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: "Phone number is required",
                validate: (value) =>
                  isValidPhoneNumber(value) || "Invalid phone number",
              }}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormControl>
                    <PhoneInput
                      defaultCountry="US"
                      placeholder="Enter a phone number"
                      value={field.value}
                      onChange={field.onChange}
                      className="focus:border focus:border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={sentStatus == "Loading..."}
              className="w-full p-7"
            >
              {sentStatus}
            </Button>
          </form>
        </Form>

        {confirmationResult && (
          <div className="flex flex-col items-center gap-3">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className="border rounded p-2 w-48"
            />
            <Button onClick={handleVerifyCode}>Verify Code</Button>
          </div>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </>
  );
}