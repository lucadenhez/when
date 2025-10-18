import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDPhidn0tIltaxcFtOzmKry7lbnbmsPPNI",
    authDomain: "when-1a5f3.firebaseapp.com",
    projectId: "when-1a5f3",
    storageBucket: "when-1a5f3.firebasestorage.app",
    messagingSenderId: "949755548593",
    appId: "1:949755548593:web:16ae4d2c50d1800bd46390",
    measurementId: "G-95TBFLDY0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };