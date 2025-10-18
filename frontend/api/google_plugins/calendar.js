//import * as dotenv from 'dotenv';
import { auth } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { userInfo } from 'os';

//dotenv.config();

export const connectGoogleCalendar = async () => {

    const authorized = await isAuthorizedForCalendar();

    const userUid = auth.currentUser.uid;

    if (!authorized) {

        const CLIENT_ID = "531545062015-l2hcfpclbs387jaek52irm7p5rsv2qhj.apps.googleusercontent.com";
        const REDIRECT_URI = "http://localhost:8000/oauth2callback";
        const SCOPES = ["https://www.googleapis.com/auth/calendar"];

        sessionStorage.setItem("firebaseUID", userUid);

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES[0]}&access_type=offline&prompt=consent`;
        window.location.href = authUrl;
    } else {
    }
};

export const isAlreadyAddedToCalendar = async (className) => {
    const user = auth.currentUser;

    if (!user) {
        console.error("User not authenticated.");
        return true;
    }

    const userUid = user.uid;

    const syllabusRef = doc(db, "users", userUid, "syllabi", className);
    const syllabusSnap = await getDoc(syllabusRef);

    if (!syllabusSnap.exists()) {
        console.warn(`Syllabus ${className} does not exist for user ${userUid}`);
        return true;
    }

    return syllabusSnap.data()["addedToCalendar"] ?? true;
};

export const isAuthorizedForCalendar = async () => {

    const userUid = auth.currentUser.uid;
    const userRef = doc(db, "users", userUid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const data = userSnap.data();
        const connected = data?.calendar_tokens?.calendarConnected || false;
        console.log("Calendar connected:", connected);
        return connected;
    } else {
        console.log("No user document found.");

        return false;
    }
}