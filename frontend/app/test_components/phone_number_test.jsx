'use client'

import React, { useState, useEffect } from 'react';
//import { auth } from './firebaseConfig'; // Your Firebase config file
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from "../../api/firebase/firebase";
import { setupRecaptcha, sendVerificationCode, verifyCodeAndSignIn } from "../../api/firebase/auth"
import { connectGoogleCalendar } from "../../api/google_plugins/calendar"

export default function PhoneAuthComponent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);


  const googleCalendar = async () => {
    await connectGoogleCalendar();
  };

  return (
    <div>
      <button onClick={googleCalendar}>
        BUTTON
      </button>
    </div>
    );
}