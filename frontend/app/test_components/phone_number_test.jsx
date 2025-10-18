'use client'

import React, { useState, useEffect } from 'react';
//import { auth } from './firebaseConfig'; // Your Firebase config file
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from "../../api/firebase/firebase";
import { setupRecaptcha, sendVerificationCode, verifyCodeAndSignIn } from "../../api/firebase/auth"

export default function PhoneAuthComponent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const handleSendCode = async () => {
    const result = await sendVerificationCode("+1"+phoneNumber);
    setConfirmationResult(result);
  };

  const handleVerifyCode = async () => {
    const verify = await verifyCodeAndSignIn(confirmationResult, verificationCode)
  }

  return (
    <div>
      <input
        type="tel"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleSendCode}>Send Code</button>

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={handleVerifyCode}>Verify Code</button>
        </>
      )}
      <div id="recaptcha-container"></div>
    </div>
    );
}