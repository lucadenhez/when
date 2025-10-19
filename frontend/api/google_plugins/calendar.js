//import * as dotenv from 'dotenv';
import { auth } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { userInfo } from 'os';

//dotenv.config();

export const connectGoogleCalendar = async () => {

    localStorage.removeItem('calendar_tokens');
    const authorized = await isAuthorizedForCalendar();

    if (!authorized) {

        const CLIENT_ID = "531545062015-l2hcfpclbs387jaek52irm7p5rsv2qhj.apps.googleusercontent.com";
        const REDIRECT_URI = "http://localhost:8000/oauth2callback";
        const SCOPES = ["https://www.googleapis.com/auth/calendar"];

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES[0]}&access_type=offline&prompt=consent`;
        window.location.href = authUrl;
    } else {
    }
};

export const isAlreadyAddedToCalendar = async () => {


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

    const tokens = localStorage.getItem('calendar_tokens');
    console.log(tokens)

    return tokens != null;
}