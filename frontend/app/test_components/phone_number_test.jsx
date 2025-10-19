'use client'

import React, { useState, useEffect } from 'react';
//import { auth } from './firebaseConfig'; // Your Firebase config file
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from "../../api/firebase/firebase";
import { setupRecaptcha, sendVerificationCode, verifyCodeAndSignIn } from "../../api/firebase/auth"
import { connectGoogleCalendar } from "../../api/google_plugins/calendar"
import { CreateEvent, AddAvailability } from "../../api/events/event"

export default function PhoneAuthComponent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);


  const event = async () => {
    await CreateEvent({"code": "eventcode0101"});
  };

  const add = async () => {
    await AddAvailability();
  }

  const google = async () => {
    await connectGoogleCalendar();
  }

  return (
    <div className='flex flex-col'>
      <button onClick={google}>
        CALENDAR
      </button>
      <button onClick={event}>
        EVENT
      </button>
      <button onClick={add}>
        ADD
      </button>
    </div>
    );
}