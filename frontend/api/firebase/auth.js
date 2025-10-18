import { auth } from "./firebase";
import { collection, getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from './firebase';

import {
  signInWithPhoneNumber, RecaptchaVerifier
} from "firebase/auth";

export const setupRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'invisible', // or 'normal' for a visible reCAPTCHA
    'callback': (response) => {

    },
    'expired-callback': () => {
      // reCAPTCHA expired, reset it
    }
  });
};

export const sendVerificationCode = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    alert('Verification code sent!');

    return confirmationResult;
  } catch (error) {
    console.error("Error sending verification code:", error);

  }
};

export const verifyCodeAndSignIn = async (confirmationResult, code) => {
  try {
    const userCredential = await confirmationResult.confirm(code);
    const user = userCredential.user;

    const userData = {
      phoneNumber: user.email,
      displayName: user.displayName || 'Mysterious',
      photoURL: user.photoURL || 'https://example.com/default-photo.jpg',
    };

    const userRef = doc(collection(db, 'users'), user.uid);

    await setDoc(userRef, userData);
    console.log("User signed in/created:", auth.currentUser.uid);
  } catch (error) {
    console.error("Error verifying code:", error);
  }
};

